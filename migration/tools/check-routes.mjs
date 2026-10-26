import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parse} from 'parse5';
const root=path.resolve(process.argv[2]||'.preview/jekyll-site');
const walk=n=>[n,...(n.childNodes||[]).flatMap(walk)];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const resolve=url=>{
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 assert(file===root||file.startsWith(root+path.sep),'Path outside build');
 if(fs.existsSync(file)&&fs.statSync(file).isFile())return file;
 const index=path.join(file,'index.html');
 return fs.existsSync(index)?index:null;
};
const aliases=[['/about/','/'],['/about.html','/'],['/resume/','/cv/'],['/markdown/','/zh/joining/'],['/md/','/zh/joining/'],['/markdown.html','/zh/joining/']];
for(const [from,to] of aliases){
 const nodes=walk(parse(fs.readFileSync(resolve(new URL(from,'https://andrewchiyz.github.io')),'utf8')));
 assert(nodes.some(n=>attr(n,'http-equiv')==='refresh'&&attr(n,'content')==='0;url='+to),from+': wrong redirect');
 assert(nodes.some(n=>n.tagName==='a'&&attr(n,'href')===to),from+': missing fallback link');
 assert(nodes.some(n=>attr(n,'rel')==='canonical'&&attr(n,'href')==='https://andrewchiyz.github.io'+to),from+': wrong canonical');
 assert(resolve(new URL(to,'https://andrewchiyz.github.io')),from+': target missing');
}
// Every original generated HTML route must exist without falling back to the old site.
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);
const originals=['index.html','404.html','about.html','markdown.html',...['zh','about','resume','markdown','md','joining','publications','publication','teaching','news','talks','cv','sitemap'].flatMap(files)];
for(const file of originals)assert(fs.existsSync(path.join(root,file)),'Missing old route: '+file);
let links=0;
for(const file of originals){
 const url=new URL('/'+file.replaceAll(path.sep,'/').replace(/index.html$/,''),'https://andrewchiyz.github.io');
 for(const node of walk(parse(fs.readFileSync(path.join(root,file),'utf8')))){
  for(const key of ['href','src']){
   const value=attr(node,key);if(!value)continue;
   const target=new URL(value,url);if(target.origin!==url.origin)continue;
   // Separate GitHub Pages project repository, outside this personal-site build.
   if(['/vision.ohmt.rfnt/','/vision.medseg.cpnet/'].some(prefix=>target.pathname.startsWith(prefix)))continue;
   assert(resolve(target),file+': broken local '+key+' '+value);links++;
  }
 }
}
console.log(`PASS: ${originals.length} original HTML routes, six redirects and ${links} internal links/assets exist in the standalone build.`);
