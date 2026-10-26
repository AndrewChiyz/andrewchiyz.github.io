import fs from 'node:fs';
import path from 'node:path';
const target=path.resolve(process.argv[2]||'.preview/jekyll-site');
const preview=path.resolve('.preview');
if(!target.startsWith(preview+path.sep))throw Error('Output must be a build directory inside .preview');
for(const folder of ['assets','images','files','licenses']) {
  if(fs.existsSync(folder))fs.cpSync(folder,path.join(target,folder),{recursive:true,force:false,errorOnExist:false});
}
console.log('Packaged static assets, images, downloads and licenses with the generated pages.');
