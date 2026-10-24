import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const routes=JSON.parse(fs.readFileSync('.preview/routes.json','utf8'));
const data=JSON.parse(fs.readFileSync('content/scholar.json','utf8'));
const targetFile=url=>path.join(process.cwd(),url.endsWith('.html')?url.slice(1):path.join(url.slice(1),'index.html'));
let links=0;
assert(fs.existsSync('.nojekyll'),'Missing static publishing marker');
for(const obsolete of ['Gemfile','_config.yml','_layouts','_includes','_sass'])assert(!fs.existsSync(obsolete),`Old framework remains: ${obsolete}`);
for(const [url,html] of Object.entries(routes)) {
 assert.equal(fs.readFileSync(targetFile(url),'utf8'),html+'\n',`Static output mismatch: ${url}`);
 assert(html.includes('<html lang='),`Missing language: ${url}`);
 assert(!/undefined|\{%|\{\{/.test(html),`Unresolved template: ${url}`);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
  const target=match[1];
  if(!target.startsWith('/'))continue;
  assert(fs.existsSync(targetFile(target))||fs.existsSync(path.join(process.cwd(),target)),`Broken target ${target} from ${url}`);links++;
 }
 if(!html.includes('http-equiv="refresh"')) {
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`Expected one h1: ${url}`);
  assert(html.includes(`href="https://andrewchiyz.github.io${url}"`),`Canonical: ${url}`);
  const alternate=url.startsWith('/zh/')?url.replace(/^\/zh/,''):'/zh'+url;
  assert(html.includes(`class="language-switch" href="${alternate}"`),`Language pair: ${url}`);
 }
}
for(const item of [...data.papers,...data.courses]) {
 assert(routes[item.permalink],`Missing detail page: ${item.permalink}`);
 assert(routes['/zh'+item.permalink],`Missing Chinese detail shell: ${item.permalink}`);
}
const before=JSON.stringify(routes);
execFileSync(process.execPath,['scripts/redesign/build.mjs']);
assert.equal(fs.readFileSync('.preview/routes.json','utf8'),before,'Build must be reproducible');
execFileSync(process.execPath,['--check','assets/js/scholar.js']);
console.log(`PASS: ${Object.keys(routes).length} static routes, ${links} local references, bilingual pairs, complete detail pages, metadata, stable generation; no Jekyll dependency.`);
