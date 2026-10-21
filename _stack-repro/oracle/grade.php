<?php
// Native STACK oracle for the stack-repro page (aacchhee/ctm-demo, _stack-repro/oracle/repro.py): loads a Moodle-XML STACK question with STACK's own API code
// (api/util/StackQuestionLoader, as the STACK API's /grade route), instantiates it for a seed,
// and for each attempt reports every input's validation state and every PRT's result,
// computed by STACK's PHP and Maxima (platform 'linux', see ../config.php).
// SPDX-License-Identifier: AGPL-3.0-or-later (runs STACK's GPL-3.0-or-later code from a checkout).
//
// Usage (cwd = this folder): php grade.php STACK_SOURCE question.xml SEED attempts.json
// attempts.json: [{"ans1": "x^2", ...}, ...]
// With --tests in place of attempts.json: the question's own question tests, run by the
// STACK API's /test route (api/controller/TestController.php).

$stack = rtrim($argv[1], '/');
require_once('../config.php');
require_once($stack . '/api/emulation/MoodleEmulation.php');
require($stack . '/api/vendor/autoload.php');
require_once($stack . '/api/util/StackQuestionLoader.php');
require_once($stack . '/api/util/StackSeedHelper.php');
require_once($stack . '/stack/cas/installhelper.class.php');

use api\util\StackQuestionLoader;
use api\util\StackSeedHelper;

if (!is_readable($CFG->dataroot . '/stack/maximalocal.mac')) {
    foreach (['', '/logs', '/plots', '/sitelibrary', '/tmp'] as $sub) {
        @mkdir($CFG->dataroot . '/stack' . $sub, 0777, true);
    }
    // The API keeps STACK at dirroot/question/type/stack; here it is the checkout itself.
    file_put_contents($CFG->dataroot . '/stack/maximalocal.mac', str_replace($CFG->dirroot . '/question/type/stack/',
        $stack . '/', stack_cas_configuration::generate_maximalocal_contents()));
}

$xml = file_get_contents($argv[2]);
$seed = (int) $argv[3];
if ($argv[4] === '--tests') {
    require_once($stack . '/api/controller/TestController.php');
    $request = (new \Slim\Psr7\Factory\ServerRequestFactory())->createServerRequest('POST', '/test')
        ->withParsedBody(['questionDefinition' => $xml, 'seed' => $seed]);
    $response = (new \api\controller\TestController())($request, (new \Slim\Psr7\Factory\ResponseFactory())->createResponse(), []);
    echo json_encode(json_decode((string) $response->getBody()), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
    exit(0);
}
$attempts = json_decode(file_get_contents($argv[4]), true);

$out = ['stack' => getenv('STACK_COMMIT') ?: trim((string) shell_exec('git -C ' . escapeshellarg($stack) . ' rev-parse HEAD')),
        'release' => null, 'maxima' => null, 'platform' => $CFG->platform, 'seed' => $seed, 'attempts' => []];
$plugin = new stdClass();
if (!defined('MATURITY_STABLE')) {
    define('MATURITY_STABLE', 200);
}
include($stack . '/version.php');
$out['release'] = $plugin->release . ' (' . $plugin->version . ')';

$fresh = function () use ($xml, $seed) {
    $question = StackQuestionLoader::loadxml($xml)['question'];
    StackSeedHelper::initialize_seed($question, $seed);
    $question->initialise_question_from_seed();
    $question->castextprocessor = new \castext2_qa_processor(new \stack_outofcontext_process());
    if (!empty($question->runtimeerrors)) {
        throw new \stack_exception(implode("\n", array_keys($question->runtimeerrors)));
    }
    return $question;
};

$q = $fresh();
$version = stack_ast_container::make_from_teacher_source('MAXIMA_VERSION_STR', '', new stack_cas_security());
$session = new stack_cas_session2([$version], null, $seed);
$session->instantiate();
$out['maxima'] = $version->get_value();
foreach ($q->inputs as $name => $input) {
    $out['teacher'][$name] = $input->get_teacher_answer();
    $out['teachervalue'][$name] = $q->get_ta_for_input($name);
}
foreach ($attempts as $answers) {
    $question = $fresh();
    $row = ['answers' => $answers, 'inputs' => [], 'gradable' => null, 'prts' => []];
    foreach ($question->inputs as $name => $input) {
        $state = $question->get_input_state($name, $answers);
        $row['inputs'][$name] = ['status' => $state->status, 'contentsmodified' => $state->contentsmodified,
            'contentsdisplayed' => $state->contentsdisplayed, 'errors' => strip_tags($state->errors),
            'note' => $state->note];
    }
    $row['gradable'] = $question->is_gradable_response($answers);
    foreach ($question->prts as $index => $prt) {
        $result = $question->get_prt_result($index, $answers, true);
        $row['prts'][$index] = [
            'score' => $result->get_score(),
            'penalty' => $result->get_penalty(),
            'answernotes' => $result->get_answernotes(),
            'errors' => $result->get_errors(),
            'feedback' => trim(strip_tags(\stack_maths::process_display_castext(
                $result->apply_placeholder_holder($result->get_feedback() ?? '')))),
        ];
    }
    $out['attempts'][] = $row;
}
echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
