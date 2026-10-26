import fs from 'node:fs';
import assert from 'node:assert/strict';
const {courses,papers}=JSON.parse(fs.readFileSync('content/scholar.json','utf8'));
const routes=['index.html','joining/index.html','teaching/index.html','publications/index.html','news/index.html','talks/index.html','cv/index.html',...[...courses,...papers].map(c=>c.permalink.slice(1)+'/index.html')];
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
console.log('PASS: shared profile updates all 90 pages; course metadata propagates; one new paper generates both lists and detail pages.');
for(const [prefix,label,other] of [['','NEWS_CHECK_EN','NEWS_CHECK_ZH'],['zh/','NEWS_CHECK_ZH','NEWS_CHECK_EN']]){
 const html=fs.readFileSync('.preview/profile-check/'+prefix+'news/index.html','utf8');
 assert(html.includes(label)&&!html.includes(other),'Incorrect news language');
 assert(html.indexOf(label)<html.indexOf('IEEE TCSVT'),'New news item did not sort first');
}
console.log('PASS: one new news file updates both language pages in the configured order.');

for(const prefix of ['', 'zh/']) {
 const html=fs.readFileSync('.preview/profile-check/'+prefix+'cv/index.html','utf8');
 assert.equal((html.match(/href="\/files\/CV_CHECK.pdf"/g)||[]).length,2,'CV download must update in sidebar and page');
 assert(!html.includes('/files/Yuzhu-Ji-CV.pdf'),'Old CV link remains');
}
console.log('PASS: shared CV download updates both sidebar and bilingual CV pages.');

for(const [prefix,label,other] of [['','NEWS_CHECK_EN','NEWS_CHECK_ZH'],['zh/','NEWS_CHECK_ZH','NEWS_CHECK_EN']]) {
 const home=fs.readFileSync('.preview/profile-check/'+prefix+'index.html','utf8');
 assert(home.includes(label)&&!home.includes(other),'New news missing or wrong language on homepage');
 assert(home.includes('PAPER_CHECK_NEW'),'Selected paper missing on homepage');
 assert(home.includes('SERVICE_CHECK'),'Shared service missing on homepage');
 assert(fs.readFileSync('.preview/profile-check/'+prefix+'cv/index.html','utf8').includes('SERVICE_CHECK'),'Shared service missing on CV');
 const list=home.match(/<ul class="news-list">([\s\S]*?)<\/ul>/)[1];
 assert.equal((list.match(/<li>/g)||[]).length,5,'Homepage must show five latest news items');
}
console.log('PASS: home news, selected papers and academic service follow their shared sources.');
