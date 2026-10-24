import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const routes=JSON.parse(fs.readFileSync('.preview/routes.json','utf8'));
const config=fs.readFileSync('_config.yml','utf8');
const known=new Map(Object.keys(routes).map(u=>[u,'generated']));
const excluded=new Set([...config.matchAll(/^  - (_pages\/[^\r\n]+)/gm)].map(m=>m[1]));
const permalinks=new Map();
for(const dir of ['_pages','_publications','_teaching','_talks']) {
 for(const file of fs.readdirSync(dir)) {
  const filename=dir+'/'+file;
  if(!/\.(md|html)$/.test(file)||excluded.has(filename))continue;
  const source=fs.readFileSync(filename,'utf8');
  const permalink=source.match(/^permalink:\s*(\/[^\s\r\n]*)/m)?.[1];
  if(!permalink)continue;
  assert(!permalinks.has(permalink),`Duplicate permalink ${permalink}: ${filename} and ${permalinks.get(permalink)}`);
  permalinks.set(permalink,filename);known.set(permalink,filename);
 }
}
let links=0;
for(const [url,html] of Object.entries(routes)) {
 assert(html.includes('<html lang='),`Missing language: ${url}`);
 assert(!html.includes('undefined'),`Unresolved data: ${url}`);
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
  const target=match[1];
  if(!target.startsWith('/'))continue;
  assert(known.has(target)||fs.existsSync(path.join(process.cwd(),target)),`Broken target ${target} from ${url}`);links++;
 }
 if(!html.includes('http-equiv="refresh"')) {
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`Expected one h1: ${url}`);
  assert(html.includes(`href="https://andrewchiyz.github.io${url}"`),`Canonical: ${url}`);
  const alternate=url.startsWith('/zh/')?url.replace(/^\/zh/,''):'/zh'+url;
  assert(html.includes(`class="language-switch" href="${alternate}"`),`Language pair: ${url}`);
 }
}
const before=JSON.stringify(routes);
execFileSync(process.execPath,['scripts/redesign/build.mjs']);
assert.equal(fs.readFileSync('.preview/routes.json','utf8'),before,'Build must be reproducible');
const data=JSON.parse(fs.readFileSync('_data/scholar.json','utf8'));
for(const paper of data.papers)assert(known.has(paper.permalink),`Lost paper URL: ${paper.permalink}`);
for(const course of data.courses)assert(known.has(course.permalink),`Lost course URL: ${course.permalink}`);
execFileSync(process.execPath,['--check','assets/js/scholar.js']);
console.log(`PASS: ${Object.keys(routes).length} generated routes, ${links} local references, bilingual pairs, canonical metadata, no duplicate permalinks, original paper/course URLs, stable generation, JavaScript syntax.`);
