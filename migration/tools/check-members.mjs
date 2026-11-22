import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';
const source='.preview/members-fixture';
fs.cpSync('migration/jekyll',source,{recursive:true,filter:p=>!/[\\/](?:vendor|\.bundle|\.jekyll-cache)(?:[\\/]|$)/.test(p)});
// Synthetic members exist only inside the ignored fixture build.
for(const [id,status,order,visible] of [['first','current',-20,true],['second','current',-10,true],['graduate','alumni',-5,true],['draft','current',0,false]]){
 const data={visible,status,order,degree:'master',year:2026,graduation_year:status==='alumni'?2028:null,
  photo:'',website:id==='first'?'https://example.org/':'',
  zh:{name:'测试-'+id,research:'研究 <方向>',highlights:'',destination:status==='alumni'?'测试去向':''},
  en:{name:'TEST-'+id,research:'Research <topic>',highlights:'',destination:status==='alumni'?'Test destination':''}};
 fs.writeFileSync(`${source}/_members/test-${id}.md`,'---\n'+JSON.stringify(data)+'\n---\n');
}
execFileSync('bundle',['exec','jekyll','build','--source',source,'--destination','.preview/members-check','--config',source+'/_config.yml'],{stdio:'pipe'});
const walk=n=>[n,...(n.childNodes||[]).flatMap(walk)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const [prefix,label,other] of [['','TEST-','测试-'],['zh/','测试-','TEST-']]){
 const html=fs.readFileSync('.preview/members-check/'+prefix+'members/index.html','utf8');
 assert(html.includes(label+'first')&&html.includes(label+'graduate'));
 assert(!html.includes(label+'draft'),'Hidden draft leaked');
 assert(html.indexOf(label+'first')<html.indexOf(label+'second'),'Member order wrong');
 assert(html.includes(prefix?'研究 &lt;方向&gt;':'Research &lt;topic&gt;'),'Card fields must be escaped');
 const nodes=walk(parse(html));
 assert(nodes.some(n=>n.tagName==='a'&&attr(n,'href')==='/'+prefix+'members/'&&attr(n,'aria-current')==='page'));
 assert(nodes.some(n=>n.tagName==='a'&&attr(n,'href')===(prefix?'/members/':'/zh/members/')));
 assert(!nodes.some(n=>n.tagName==='img'&&attr(n,'src')===''),'Empty image must use a placeholder');
 assert(nodes.some(n=>attr(n,'href')==='https://example.org/'),'Optional homepage missing');
}
// A malformed visible record must fail the build instead of silently disappearing.
const bad=source+'/_members/test-first.md';fs.writeFileSync(bad,fs.readFileSync(bad,'utf8').replace('"current"','"typo"'));
assert.throws(()=>execFileSync('bundle',['exec','jekyll','build','--source',source,'--destination','.preview/members-check-invalid','--config',source+'/_config.yml'],{stdio:'pipe'}));
console.log('PASS: member records generate both languages, group/order correctly, hide drafts, escape fields and reject invalid data.');
