import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseCSV,parseBibTeX,mergeRecords} from './import-publications.mjs';
test('Scholar CSV preserves comma, escaped quote and multiline title',()=>{
 const rows=parseCSV('\uFEFF"Authors","Title","Publication","Year"\r\n"Ji, Yuzhu; Zhang, Haijun","A, ""quoted""\nTitle","Journal",2025');
 assert.equal(rows[0].title,'A, "quoted"\nTitle');assert.equal(rows[0].year,'2025');
 assert.throws(()=>parseCSV('Authors,Title\n"unclosed'),/Unclosed/);
});
test('BibTeX handles nested braces, escaped ampersand and author names',()=>{
 const rows=parseBibTeX('@inproceedings{ji2025, title={Learning {3D} Shapes \\& Motion}, author={Ji, Yuzhu and Zhang, Haijun}, booktitle={ICCV}, year={2025}}');
 const result=mergeRecords([],rows,'scholar.bib');
 assert.equal(result.papers[0].title,'Learning 3D Shapes & Motion');
 assert.equal(result.papers[0].authors,'Yuzhu Ji, Haijun Zhang');assert.equal(result.papers[0].type,'conference');
 assert.throws(()=>parseBibTeX('@article{a,title={broken'),/Unclosed/);
});
test('Deduplication preserves curated project URL, abstract, selected status and existing permalink',()=>{
 const old=[{title:'One-shot motion transfer',year:2024,authors:'Yuzhu Ji',url:'https://example.org/project',permalink:'/publication/old',selected:true,abstract:'Existing abstract',type:'journal'}];
 const r={title:'One Shot Motion Transfer',author:'Ji, Yuzhu',year:'2025',journal:'IEEE Transactions on Multimedia',doi:'10.1/example'};
 const result=mergeRecords(old,[r,r],'scholar.bib');
 assert.equal(result.papers.length,1);assert.equal(result.duplicates,1);assert.equal(result.papers[0].year,2025);
 for(const key of ['url','permalink','selected','abstract'])assert.equal(result.papers[0][key],old[0][key]);
 assert.equal(old[0].year,2024);
});
test('Missing dates fail without inventing years; arXiv is not classified as a journal',()=>{
 assert.throws(()=>mergeRecords([],[{title:'Undated',authors:'Ji, Yuzhu'}],'a.csv'),/year is missing/);
 const result=mergeRecords([],[{title:'A preprint',author:'Ji, Yuzhu',year:'2026',journal:'arXiv preprint arXiv:2601.00001'}],'a.bib');
 assert.equal(result.papers[0].type,'preprint');
});
test('Author-provided formatting and journal-typed conference entries are normalized',()=>{
 const rows=parseBibTeX('@article{a,author={\\textbf{Yuzhu Ji} and Hu, Wei},title={A {3D} Model},journal={\\textbf{ECAI} 2023, Krak{\\\'{o}}w},year={2023},doi={10.1/a\\_1}}');
 const p=mergeRecords([],rows,'mypapers.bib').papers[0];
 assert.equal(p.authors,'Yuzhu Ji, Wei Hu');assert.equal(p.venue,'ECAI 2023, Kraków');
 assert.equal(p.doi,'10.1/a_1');assert.equal(p.type,'conference');assert.equal(p.source.provider,'Author-provided BibTeX');
});
