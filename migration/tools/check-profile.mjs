import fs from 'node:fs';
import assert from 'node:assert/strict';
const {courses,papers}=JSON.parse(fs.readFileSync('content/scholar.json','utf8'));
const routes=['joining/index.html','teaching/index.html','publications/index.html',...[...courses,...papers].map(c=>c.permalink.slice(1)+'/index.html')];
for(const [prefix,label] of [['','PROFILE_CHECK_EN'],['zh/','PROFILE_CHECK_ZH']])for(const route of routes){
 const file=prefix+route;
 const html=fs.readFileSync('.preview/profile-check/'+file,'utf8');
 assert(html.includes(label),file+': position did not update');
 assert(html.includes('mailto:sample-check@example.invalid'),file+': contact did not update');
 assert(!html.includes('yuzhu.ji@gdut.edu.cn'),file+': old email remains');
}
for(const [prefix,label] of [['','COURSE_CHECK_EN'],['zh/','COURSE_CHECK_ZH']]){
 for(const route of ['teaching/index.html','teaching/2024-fall-teaching-1/index.html']){
  assert(fs.readFileSync('.preview/profile-check/'+prefix+route,'utf8').includes(label),'Shared course title did not update '+prefix+route);
 }
}
for(const prefix of ['','zh/']){
 assert(fs.readFileSync('.preview/profile-check/'+prefix+'publications/index.html','utf8').includes('PAPER_CHECK_NEW'),'New paper missing from list');
 const detail=fs.readFileSync('.preview/profile-check/'+prefix+'publication/migration-check-paper/index.html','utf8');
 assert(detail.includes('PAPER_CHECK_NEW')&&detail.includes('A test abstract.'),'New paper detail not generated');
}
console.log('PASS: shared profile updates all 82 pages; course metadata propagates; one new paper generates both lists and detail pages.');
