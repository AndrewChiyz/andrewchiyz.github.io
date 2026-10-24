import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const types={'.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.pdf':'application/pdf','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost').pathname;
 const routes=JSON.parse(fs.readFileSync('.preview/routes.json','utf8'));
 if(routes[url]) {res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(routes[url]);return;}
 const target=path.resolve(root,'.'+decodeURIComponent(url));
 if(target.startsWith(root+path.sep)&&['/assets/','/images/','/files/'].some(p=>url.startsWith(p))&&fs.existsSync(target)&&fs.statSync(target).isFile()) {res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(res);return;}
 res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end('<h1>Local preview: page not rendered</h1><p>Legacy publication and course pages require a Jekyll build. <a href="/">Home</a></p>');
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
