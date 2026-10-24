import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.pdf':'application/pdf','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost').pathname;
 let target;
 try{target=path.resolve(root,'.'+decodeURIComponent(url));}catch{res.writeHead(400);res.end();return;}
 if(target===root||target.startsWith(root+path.sep)) {
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory()) {
   if(!url.endsWith('/')){res.writeHead(301,{Location:url+'/'});res.end();return;}
   target=path.join(target,'index.html');
  }
  const allowed=Object.hasOwn(types,path.extname(target))&&!url.startsWith('/scripts/');
  if(allowed&&fs.existsSync(target)&&fs.statSync(target).isFile()){res.writeHead(200,{'Content-Type':types[path.extname(target)]});fs.createReadStream(target).pipe(res);return;}
 }
 res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync('404.html'));
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
