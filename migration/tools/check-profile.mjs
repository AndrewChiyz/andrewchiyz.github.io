import fs from 'node:fs';
import assert from 'node:assert/strict';
for(const [file,label] of [['joining/index.html','PROFILE_CHECK_EN'],['zh/joining/index.html','PROFILE_CHECK_ZH']]){
 const html=fs.readFileSync('.preview/profile-check/'+file,'utf8');
 assert(html.includes(label),file+': position did not update');
 assert(html.includes('mailto:sample-check@example.invalid'),file+': contact did not update');
 assert(!html.includes('yuzhu.ji@gdut.edu.cn'),file+': old email remains');
}
console.log('PASS: editing one profile file updates the sidebar and contact links in both languages.');
