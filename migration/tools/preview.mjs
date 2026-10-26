import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), built=path.resolve(root,'.preview/jekyll-site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2','.pdf':'application/pdf','.svg':'image/svg+xml'};
if(!fs.existsSync(path.join(built,'joining/index.html')))throw Error('Build the Jekyll sample into .preview/jekyll-site first. See migration/jekyll/README.md.');
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 const rel=pathname.replace(/^\//,'');
 const candidates=[path.resolve(built,rel),path.resolve(root,rel)];
 for(let i=0;i<candidates.length;i++){
  let file=candidates[i];const base=i===0?built:root;
  if(file!==base&&!file.startsWith(base+path.sep))continue;
  if(i===1&&!/^(assets|images|files|licenses)(\/|$)/.test(rel))continue;
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!types[path.extname(file)]||!fs.existsSync(file)||!fs.statSync(file).isFile())continue;
  res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});
  // Previewing must not add local visits to the real counter.
  if(file.endsWith('.html'))res.end(fs.readFileSync(file,'utf8').replace(/<script\b[^>]*id="mapmyvisitors"[^>]*><\/script>/g,'<small>Visitor map paused in local preview</small>'));
  else fs.createReadStream(file).pipe(res);
  return;
 }
 const notFound=path.join(built,'404.html');
 res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
 res.end(fs.existsSync(notFound)?fs.readFileSync(notFound,'utf8').replace(/<script\b[^>]*id="mapmyvisitors"[^>]*><\/script>/g,'<small>Visitor map paused in local preview</small>'):'Not found');
}).listen(4174,'127.0.0.1',()=>console.log('Jekyll sample: http://127.0.0.1:4174/zh/joining/ (English: /joining/)'));
