import fs from 'node:fs';
import path from 'node:path';
const source=path.resolve('.preview/jekyll-site');
if(!fs.existsSync(path.join(source,'index.html')))throw Error('Build the site before publishing');
let count=0;
function copyPages(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())copyPages(file);
    else if(entry.name.endsWith('.html')){
      const target=path.relative(source,file);
      fs.mkdirSync(path.dirname(target),{recursive:true});
      fs.copyFileSync(file,target);count++;
    }
  }
}
copyPages(source);
fs.copyFileSync(path.join(source,'assets/css/migration-layout.css'),'assets/css/migration-layout.css');
console.log(`Updated ${count} generated HTML pages and the shared layout stylesheet.`);
