// Optional maintenance step after adding Chinese characters to the site.
// Normal builds are offline and use the checked-in fonts.
import fs from 'node:fs';
const directory='assets/fonts';fs.mkdirSync(directory,{recursive:true});
const routes=JSON.parse(fs.readFileSync('.preview/routes.json','utf8'));
const text=[...new Set(Object.values(routes).join('').match(/[\u2e80-\u9fff\u3000-\u303f\uff00-\uffef]/gu))].sort().join('');
const headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'};
async function get(url){const r=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`${r.status}: ${url.slice(0,100)}`);return r;}
async function font(family,file,characters) {
 const css=await(await get('https://fonts.googleapis.com/css2?family='+family+':wght@400..800&display=swap'+(characters?'&text='+encodeURIComponent(characters):''))).text();
 const blocks=css.match(/@font-face\s*\{[^}]+\}/g)||[];
 const block=characters?blocks[0]:blocks.find(b=>b.includes('U+0000-00FF'));
 if(!block)throw new Error('Font declaration not found: '+family);
 const url=block.match(/url\(([^)]+)\)/)?.[1];if(!url)throw new Error('Font URL missing');
 const bytes=Buffer.from(await(await get(url)).arrayBuffer());
 if(bytes.subarray(0,4).toString()!=='wOF2')throw new Error('Expected WOFF2');
 fs.writeFileSync(directory+'/'+file,bytes);
 console.log(`${file}: ${bytes.length} bytes`);
}
await font('Source+Sans+3','source-sans3-latin.woff2');
await font('Noto+Sans+SC','noto-sans-sc-subset.woff2',text);
for(const [source,file] of [['sourcesans3','source-sans3-OFL.txt'],['notosanssc','noto-sans-sc-OFL.txt']]) {
 const entry=await(await get('https://api.github.com/repos/google/fonts/contents/ofl/'+source+'/OFL.txt')).json();
 const license=Buffer.from(entry.content,'base64').toString('utf8');
 if(!license.includes('SIL OPEN FONT LICENSE'))throw new Error('Missing font license');
 fs.writeFileSync('licenses/'+file,license);
}
fs.writeFileSync(directory+'/subset-characters.json',JSON.stringify({family:'Noto Sans SC',characters:text},null,2)+'\n');
console.log(`Chinese subset covers ${[...text].length} characters; licenses retained.`);
