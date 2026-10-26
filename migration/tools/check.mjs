import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
const walk=(n)=>[n,...(n.childNodes||[]).flatMap(walk)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const findClass=(doc,c)=>walk(doc).find(n=>(attr(n,'class')||'').split(' ').includes(c));
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).filter(c=>!['script','style'].includes(c.tagName)).map(text).join('');
const compact=s=>s.replace(/\s+/g,'').replaceAll('\u2019',"'").replaceAll('\u2018',"'");
const shape=n=>n.nodeName==='#text'?(n.value.trim()?'text':null):n.nodeName==='#comment'?null:[n.tagName||n.nodeName,(n.attrs||[]).filter(a=>!['markdown'].includes(a.name)).sort((a,b)=>a.name.localeCompare(b.name)),...(n.childNodes||[]).map(shape).filter(Boolean)];
const output=process.argv[2]||'.preview/jekyll-site';
const {courses,papers}=JSON.parse(fs.readFileSync('content/scholar.json','utf8'));
const routes=['index.html','joining/index.html','teaching/index.html','publications/index.html','news/index.html','talks/index.html','cv/index.html',...[...courses,...papers].map(c=>c.permalink.slice(1)+'/index.html')];
for(const lang of ['en','zh'])for(const base of routes){
 const route=(lang==='zh'?'zh/':'')+base;
 const old=parse(fs.readFileSync(route,'utf8'));
 const html=fs.readFileSync(output+'/'+route,'utf8');const fresh=parse(html);
 assert(!/\{%|\{\{|markdown="1"/.test(html.replace(/<!--[^]*?-->/g,'')),'Unrendered template');
 const home=base==='index.html';
 const a=findClass(old,home?'page__content':'academic-detail'),b=findClass(fresh,home?'page__content':'academic-detail');
 if(home){
  // Home now uses the same five newest records as the news archive.
  const archive=parse(fs.readFileSync(output+'/'+(lang==='zh'?'zh/':'')+'news/index.html','utf8'));
  findClass(a,'news-list').childNodes=findClass(archive,'news-list').childNodes.filter(n=>n.tagName==='li').slice(0,5);
 }
 assert.equal(compact(text(b)),compact(text(a)),lang+': content changed');
 assert.deepEqual(shape(b),shape(a),lang+': content structure changed');
 const sharedBaseline=parse(fs.readFileSync((lang==='zh'?'zh/':'')+'joining/index.html','utf8'));
 for(const c of ['sidebar','masthead','page__footer']){
  const reference=c==='masthead'?old:sharedBaseline;
  assert.equal(compact(text(findClass(fresh,c))),compact(text(findClass(reference,c))),lang+': '+c+' text changed');
  assert.deepEqual(shape(findClass(fresh,c)),shape(findClass(reference,c)),lang+': '+c+' structure changed');
 }
 const styles=doc=>walk(doc).filter(n=>n.tagName==='link'&&attr(n,'rel')==='stylesheet').map(n=>attr(n,'href'));
 assert.deepEqual(styles(fresh),[...styles(old),'/assets/css/migration-layout.css?v=1'],'Unexpected styles changed');
 assert.equal(walk(fresh).filter(n=>n.tagName==='h1').length,1);
 const canonical=walk(fresh).find(n=>attr(n,'rel')==='canonical');
 const originalCanonical=walk(old).find(n=>attr(n,'rel')==='canonical');
 assert.equal(attr(canonical,'href'),attr(originalCanonical,'href'),route+': canonical URL changed');
 console.log('PASS '+route+': content, structure, navigation, metadata, and styles.');
}
