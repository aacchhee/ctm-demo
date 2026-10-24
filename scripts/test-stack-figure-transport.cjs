/* The maintained iframe adapter consumes only the generic public projection. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const sent = [], handlers = {}, parent = {};
let configured = 0;
const box = {clientWidth:0,clientHeight:0,after() {}};
const toolbar = {replaceChildren() {}};
const document = {documentElement:{},head:{appendChild() {}},querySelector() {return box;},createElement() {return toolbar;}};
const context = {kind:'tangent',document,window:{parent,addEventListener(type,fn) {handlers[type] = fn;}},configure() {configured++;}};
parent.postMessage = message => sent.push(message);
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/stack/figure-common.js','utf8'),context);
assert.equal(sent[0].protocol,'ctm-variant');
assert.equal(sent[0].label,'stack-tangent');
const values = {p1:2,p2:-1,x0:0};
function message(source,data) {handlers.message({source,data});}
message({}, {protocol:'ctm-variant',label:'stack-tangent',id:'a',values});
message(parent, {protocol:'ctm-variant',label:'stack-angle',id:'a',values});
message(parent, {protocol:'ctm-stack-figure',type:'variant',kind:'tangent',key:'a',params:values});
assert.equal(configured,0);
message(parent,{protocol:'ctm-variant',label:'stack-tangent',id:'a',n:null,values});
assert.equal(configured,1);assert.equal(context.params,values);
message(parent,{protocol:'ctm-variant',label:'stack-tangent',id:'a',n:null,values});
message(parent,{protocol:'jsxgraph-quarto-assessment',type:'layout',assessmentId:'stack-tangent-board'});
assert.equal(configured,1);
message(parent,{protocol:'ctm-variant',label:'stack-tangent',id:'b',n:null,values:{p1:3,p2:-1,x0:0}});
assert.equal(configured,2);assert.equal(context.params.p1,3);
console.log('Generic STACK figure projection, source/label guards and same-identity layout passed.');
