import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

export function parseCSV(text) {
 const rows=[];let row=[],cell='',quoted=false;
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++) {
  const c=text[i];
  if(c==='"') {
   if(quoted&&text[i+1]==='"'){cell+='"';i++;}
   else if(quoted){quoted=false;}
   else if(!cell){quoted=true;}
   else throw new Error('Unexpected quote in CSV');
  } else if(c===','&&!quoted){row.push(cell);cell='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}
  else cell+=c;
 }
 if(quoted)throw new Error('Unclosed CSV quote');
 if(cell||row.length){row.push(cell);rows.push(row);}
 if(!rows.length)return [];
 const headers=rows.shift().map(h=>h.trim().toLowerCase());
 if(!headers.includes('title')||!headers.includes('authors'))throw new Error('Expected Google Scholar CSV columns Title and Authors');
 return rows.map((values,index)=>{
  if(values.length!==headers.length)throw new Error(`CSV row ${index+2} has an unexpected column count`);
  return Object.fromEntries(headers.map((h,i)=>[h,values[i].trim()]));
 });
}

const plain=text=>text
 .replace(/\\(?:textbf|textit|emph|textrm|mathrm|textnormal)\s*/g,'')
 .replace(/\\(['`"^~])\s*\{?([A-Za-z])\}?/g,(_,mark,letter)=>(letter+({"'":'\u0301','`':'\u0300','"':'\u0308','^':'\u0302','~':'\u0303'}[mark])).normalize('NFC'))
 .replace(/\\&/g,'&').replace(/\\([_%#$])/g,'$1').replace(/[{}]/g,'').replace(/\s+/g,' ').trim();
export function parseBibTeX(text) {
 const records=[];let i=0;
 const space=()=>{while(/\s/.test(text[i]||'')&&i<text.length)i++;};
 while(i<text.length) {
  if(text[i]!=='@'){i++;continue;}
  const type=text.slice(++i).match(/^\w+/)?.[0];
  if(!type)throw new Error('Invalid BibTeX entry type');i+=type.length;space();
  const opener=text[i++],closer=opener==='{'?'}':')';
  if(!['{','('].includes(opener))throw new Error('Invalid BibTeX entry');
  if(['comment','preamble','string'].includes(type.toLowerCase()))throw new Error('Please export plain article entries without BibTeX macros');
  const comma=text.indexOf(',',i);if(comma<0)throw new Error('Missing BibTeX entry key');
  const item={entrytype:type.toLowerCase(),key:text.slice(i,comma).trim()};i=comma+1;
  while(i<text.length) {
   space();if(text[i]===','){i++;continue;}if(text[i]===closer){i++;break;}
   const field=text.slice(i).match(/^[\w-]+/)?.[0];if(!field)throw new Error('Invalid BibTeX field');i+=field.length;space();
   if(text[i++]!=='=')throw new Error('Expected BibTeX field assignment');space();
   let value='';
   if(text[i]==='{') {
    i++;let depth=1;
    while(i<text.length&&depth){const c=text[i++];if(c==='\\'&&i<text.length){value+=c+text[i++];continue;}if(c==='{')depth++;if(c==='}')depth--;if(depth)value+=c;}
    if(depth)throw new Error('Unclosed BibTeX braces');
   } else if(text[i]==='"') {
    i++;let closed=false;
    while(i<text.length){const c=text[i++];if(c==='\\'&&i<text.length){value+=c+text[i++];continue;}if(c==='"'){closed=true;break;}value+=c;}
    if(!closed)throw new Error('Unclosed BibTeX string');
   } else {const begin=i;while(i<text.length&&text[i]!==','&&text[i]!==closer)i++;value=text.slice(begin,i);}
   item[field.toLowerCase()]=plain(value);
  }
  if(!item.title)throw new Error('BibTeX entry has no title');records.push(item);
 }
 if(!records.length)throw new Error('No BibTeX records found');return records;
}

export const titleKey=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const authorName=name=>{const parts=name.trim().split(',').map(s=>s.trim());return parts.length===2?`${parts[1]} ${parts[0]}`:name.trim();};
function classify(record,venue) {
 if(/arxiv|preprint|\bcorr\b/i.test(venue))return 'preprint';
 if(record.entrytype==='inproceedings'||/proceedings|conference|\b(CVPR|ICCV|ECCV|ICML|NeurIPS|AAAI|IJCAI|ECAI|ICASSP|ICME|PRCV|BIBM|KDD)\b/i.test(venue))return 'conference';
 if(record.entrytype==='article'||/transactions|journal|pattern recognition|neurocomputing|information sciences|expert systems/i.test(venue))return 'journal';
 return 'other';
}
export function mergeRecords(existing,records,sourceFile) {
 const papers=structuredClone(existing);const index=new Map(papers.map((p,i)=>[titleKey(p.title),i]));
 let added=0,updated=0,duplicates=0;const seen=new Set();
 for(const r of records) {
  const title=plain(r.title||'');if(!title)throw new Error('A record has no title');
  const key=titleKey(title);if(seen.has(key)){duplicates++;continue;}seen.add(key);
  const oldIndex=index.get(key),old=oldIndex===undefined?undefined:papers[oldIndex];
  const year=/^\d{4}$/.test(r.year||'')?Number(r.year):old?.year;
  if(!year)throw new Error(`Publication year is missing for: ${title}. Please supply or confirm the year before importing.`);
  const authorText=r.author||r.authors||'';
  const authors=(r.author?authorText.split(/\s+and\s+/):authorText.split(';')).map(authorName).filter(Boolean).join(', ');
  if(!authors&&!old?.authors)throw new Error(`Author list is missing: ${title}`);
  const venue=r.journal||r.booktitle||r.publication||old?.venue||'';
  const type=classify(r,venue);
  const doi=(r.doi||'').replace(/^https?:\/\/(?:dx\.)?doi.org\//,'');
  const short=old?.short||venue.match(/\b(CVPR|ICCV|ECCV|ICML|NeurIPS|AAAI|IJCAI|ECAI|ICASSP|ICME|PRCV|BIBM|KDD|DASFAA|DSAA)\b/i)?.[0]||({journal:'Journal',conference:'Conference',preprint:'Preprint',other:'Publication'}[type]);
  const citation=`${authors||old?.authors}. ${title}. ${venue}${r.volume?', '+r.volume:''}${r.number?'('+r.number+')':''}${r.pages?', '+r.pages.replace(/--/g,'–'):''}, ${year}.`;
  const paper={...old,title,authors:authors||old?.authors,venue,year,type:type==='other'&&old?old.type:type,short,citation,
   permalink:old?.permalink||`/publication/${year}-${createHash('sha256').update(key).digest('hex').slice(0,12)}`,
   selected:old?.selected||false,url:old?.url||r.url||(doi?'https://doi.org/'+doi:''),
   source:{provider:/\.csv$/i.test(sourceFile)?'Google Scholar export':'Author-provided BibTeX',file:path.basename(sourceFile),...(r.biburl?{record:r.biburl}:{})}};
  for(const field of ['volume','number','pages','publisher'])if(r[field])paper[field]=r[field];
  if(doi)paper.doi=doi;
  if(oldIndex===undefined){index.set(key,papers.length);papers.push(paper);added++;}else{papers[oldIndex]=paper;updated++;}
 }
 papers.sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title));
 return {papers,added,updated,duplicates};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
 const input=process.argv[2];
 if(!input){console.error('Usage: node scripts/import-publications.mjs scholar.csv|scholar.bib [--apply]');process.exitCode=1;}
 else {
  const text=fs.readFileSync(input,'utf8');
  const records=/\.csv$/i.test(input)?parseCSV(text):parseBibTeX(text);
  const filename='content/scholar.json',data=JSON.parse(fs.readFileSync(filename,'utf8'));
  const result=mergeRecords(data.papers,records,input);
  console.log(JSON.stringify({inputRecords:records.length,added:result.added,updated:result.updated,duplicateInputRows:result.duplicates,total:result.papers.length,apply:process.argv.includes('--apply')},null,2));
  if(process.argv.includes('--apply')){data.papers=result.papers;fs.writeFileSync(filename,JSON.stringify(data,null,2)+'\n');console.log('Imported. Run npm run build:site and npm run check:site.');}
 }
}
