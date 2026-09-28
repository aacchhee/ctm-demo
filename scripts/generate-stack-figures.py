"""Embed the maintained JavaScript sources in Quarto JSXGraph blocks."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
assets=root/'assets/stack'
for kind in ['triangles','values','angle','tangent']:
    source=(assets/'figure-common.js').read_text()+'\n'+(assets/({'values':'circle','angle':'circle'}.get(kind,kind)+'.js')).read_text()
    # Declare the topic before the iframe sends its ready message.
    source=f'var kind = "{kind}";\n'+source
    block='```{.jsxgraph assessment_id="stack-'+kind+'-board" width="760" height="480" style="width:100%;max-width:760px;height:auto;aspect-ratio:19/12;min-height:360px;border:1px solid #ccd5df;border-radius:6px;"}\n'+source+'\n```\n'
    (root/f'_includes/stack/{kind}-figure.md').write_text(block)
