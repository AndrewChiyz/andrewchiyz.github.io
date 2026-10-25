import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
const walk=(n)=>[n,...(n.childNodes||[]).flatMap(walk)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const findClass=(doc,c)=>walk(doc).find(n=>(attr(n,'class')||'').split(' ').includes(c));
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).filter(c=>!['script','style'].includes(c.tagName)).map(text).join('');
const compact=s=>s.replace(/\s+/g,'').replaceAll('\u2019',"'").replaceAll('\u2018',"'");
const shape=n=>n.nodeName==='#text'?(n.value.trim()?'text':null):n.nodeName==='#comment'?null:[n.tagName||n.nodeName,(n.attrs||[]).filter(a=>!['markdown'].includes(a.name)).sort((a,b)=>a.name.localeCompare(b.name)),...(n.childNodes||[]).map(shape).filter(Boolean)];
for(const lang of ['en','zh']){
 const route=lang==='zh'?'zh/joining/index.html':'joining/index.html';
 const old=parse(fs.readFileSync(route,'utf8'));
 const html=fs.readFileSync('.preview/jekyll-site/'+route,'utf8');const fresh=parse(html);
 assert(!/\{%|\{\{|markdown="1"/.test(html.replace(/<!--[^]*?-->/g,'')),'Unrendered template');
 const a=findClass(old,'joining-page'),b=findClass(fresh,'joining-page');
 assert.equal(compact(text(b)),compact(text(a)),lang+': content changed');
 assert.deepEqual(shape(b),shape(a),lang+': content structure changed');
 for(const c of ['sidebar','masthead','page__footer']){
  assert.equal(compact(text(findClass(fresh,c))),compact(text(findClass(old,c))),lang+': '+c+' text changed');
  assert.deepEqual(shape(findClass(fresh,c)),shape(findClass(old,c)),lang+': '+c+' structure changed');
 }
 const styles=doc=>walk(doc).filter(n=>n.tagName==='link'&&attr(n,'rel')==='stylesheet').map(n=>attr(n,'href'));
 assert.deepEqual(styles(fresh),[...styles(old),'/assets/css/migration-layout.css?v=1'],'Unexpected styles changed');
 assert.equal(walk(fresh).filter(n=>n.tagName==='h1').length,1);
 console.log('PASS '+lang+': content, DOM structure, sidebar, navigation, footer, and styles match the current page.');
}
