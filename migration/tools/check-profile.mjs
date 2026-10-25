import fs from 'node:fs';
import assert from 'node:assert/strict';
const courses=JSON.parse(fs.readFileSync('content/scholar.json','utf8')).courses;
const routes=['joining/index.html','teaching/index.html',...courses.map(c=>c.permalink.slice(1)+'/index.html')];
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
console.log('PASS: shared profile updates all 16 pages; shared course titles update both lists and details.');
