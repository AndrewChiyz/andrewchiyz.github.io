import fs from 'node:fs';
import path from 'node:path';
import { renderShell } from './theme.mjs';
import { renderTeaching, renderCoursePoster } from './teaching.mjs';
import { renderJoining } from './joining.mjs';
import { renderAbout } from './about.mjs';
const root = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(root, 'content/scholar.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href = (key, zh) => `${zh ? '/zh' : ''}/${key === 'home' ? '' : key + '/'}`;
const names = {home:['Home','首页'], publications:['Publications','学术论文'], joining:['Join Us','加入我们'], teaching:['Teaching','教学'], news:['News','动态'], talks:['Talks','学术报告'], cv:['CV','个人履历']};
const titles = {home:['About me','关于我'], publications:['Publications','学术论文'], joining:['Join Us','加入我们'], teaching:['Teaching','课程教学'], news:['Highlights & News','亮点与动态'], talks:['Talks & tutorials','报告与教程'], cv:['Curriculum vitae','个人履历']};
function papers(zh, selected = false) {
 return data.papers.filter(p => !selected || p.selected).sort((a,b)=>selected?(a.selectedOrder||99)-(b.selectedOrder||99):0).map(p => `<article class="paper" data-paper data-type="${p.type}" data-search="${esc(p.title+' '+p.citation+' '+p.venue+' '+p.year)}"><div class="paper-meta"><span class="venue">${esc(p.short)}</span><span>${p.year}</span></div><div><h${selected?3:2}><a href="${esc(p.permalink)}">${esc(p.title)}</a></h${selected?3:2}><p class="authors">${esc(p.authors).replace(/Yuzhu Ji|Ji, Yuzhu/g,'<strong>$&</strong>')}</p><p class="journal">${esc(p.venue)}</p><div class="paper-links">${p.url ? `<a href="${esc(p.url)}">${p.url.includes('github.com/') ? 'Code' : p.url.includes('github.io/') ? 'Project' : 'Paper'} ↗</a>` : ''}<a href="${esc(p.permalink)}">${zh?(p.abstract?'摘要':'详情'):(p.abstract?'Abstract':'Details')} →</a><details><summary>${zh?'引用':'Cite'}</summary><p>${esc(p.citation)}</p><button type="button" data-copy>${zh?'复制引用':'Copy citation'}</button></details></div></div></article>`).join('');
}
function news(zh, limit) {return `<ul class="news-list">${data.news.slice(0,limit).map(n=>`<li><time datetime="${esc(n.date.replace('.','-'))}">${esc(n.date)}</time><span>${esc(n[zh?'zh':'en']).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}</span></li>`).join('')}</ul>`;}
function head(label, url, zh){return `<div class="section-heading"><h2>${label}</h2>${url?`<a href="${url}">${zh?'查看全部':'View all'} <span aria-hidden="true">↗</span></a>`:''}</div>`;}
function body(key, zh) {
 const t=(a,b)=>zh?b:a;
 if(key==='home') return `${renderAbout(data,zh)}<section>${head(t('🏆 Highlights & News','🏆 亮点与动态'),href('news',zh),zh)}${news(zh,4)}</section><section>${head(t('Selected publications','代表性论文'),href('publications',zh),zh)}${papers(zh,true)}</section><section>${head(t('Academic service','学术服务'),href('cv',zh),zh)}<p>${t('Reviewer for','期刊审稿：')} ${esc(data.academicService.journals.join(', '))}.</p><p>${t('Conference reviewing includes','会议审稿：')} ${esc(data.academicService.conferences.join(', '))}.</p></section>`;
 if(key==='publications') return `<p class="page-lead">${t('Research in computer vision, medical image analysis, and representation learning.','计算机视觉、医学图像分析及表示学习相关研究成果。')}</p><p class="subtle">${t('This first edition includes publications migrated from the previous website. See also','首版收录旧主页已有论文，更多成果可参见')} <a href="${data.scholar}">Google Scholar ↗</a> · <a href="${data.dblp}">DBLP ↗</a></p><div class="paper-tools"><label class="search-label">${t('Search publications','搜索论文')}<input type="search" id="paper-search" placeholder="${t('Title, author, venue…','标题、作者、期刊或会议…')}"></label><div class="filters" role="group" aria-label="${t('Publication type','论文类型')}"><button class="active" data-filter="all" aria-pressed="true">${t('All','全部')}</button><button data-filter="journal" aria-pressed="false">${t('Journal','期刊')}</button><button data-filter="conference" aria-pressed="false">${t('Conference','会议')}</button></div></div><p id="result-count" class="subtle" aria-live="polite"></p><div>${papers(zh)}</div><p id="empty-results" hidden>${t('No publications match your search.','没有符合条件的论文。')}</p>`;
 if(key==='news')return `<p class="page-lead">${t('Research highlights, student achievements, and news, archived by date.','研究亮点、学生成果与学术动态，按时间归档。')}</p><p class="subtle">${t('Updates below were migrated from the previous website.','以下动态迁移自旧主页。')}</p>${news(zh)}`;
 if(key==='teaching')return renderTeaching(data,zh);
 if(key==='joining')return renderJoining(data,zh);
 if(key==='talks')return `<p class="page-lead">${t('Sharing methods, ideas, and research practice.','分享研究方法、思考与实践。')}</p><article class="course"><div class="eyebrow">2024.07 · ${t('TUTORIAL','教程报告')}</div><h2>Human Motion Transfer: Techniques, Models and Applications</h2><p class="subtle">NCAA · ${t('Guilin, China','中国桂林')}</p><p>${t('An introduction to one-shot, few-shot, and video-specific human motion transfer, feature warping, generative models, and neural scene representations, with applications in virtual reality, teleconferencing, and digital humans.','介绍单样本、少样本及视频特定的人体运动迁移任务，以及特征变形、生成模型和神经场景表示等方法，探讨虚拟现实、远程会议和数字人应用。')}</p></article>`;
 if(key==='cv')return `<p class="page-lead">${t('Education, appointments, and academic service.','教育背景、工作经历与学术服务。')}</p><section><h2>${t('Appointments','工作经历')}</h2>${data.jobs.map(j=>`<div class="timeline-row"><span>${j.date}</span><div><h3>${esc(j[zh?'zh':'en'])}</h3><p>${esc(j[zh?'orgZh':'org'])}</p></div></div>`).join('')}</section><section><h2>${t('Education','教育背景')}</h2>${data.education.map(e=>`<div class="timeline-row"><span>${e.date}</span><div><h3>${esc(e[zh?'zh':'en'])}</h3><p>${esc(e[zh?'orgZh':'org'])}</p></div></div>`).join('')}</section><section><h2>${t('Research funding','科研项目')}</h2><ul>${data.grants.map(g=>`<li>${esc(g[zh?'zh':'en'])}</li>`).join('')}</ul></section><section><h2>${t('Academic appointments','学术任职')}</h2><ul>${data.appointments.map(a=>`<li>${esc(a[zh?'zh':'en'])}</li>`).join('')}</ul><h3>${t('Professional memberships','学术组织')}</h3><ul>${data.memberships.map(m=>`<li>${esc(m[zh?'zh':'en'])}</li>`).join('')}</ul></section><section><h2>${t('Academic service','学术服务')}</h2><h3>${t('Journal reviewer','期刊审稿')}</h3><p>${esc(data.academicService.journals.join(', '))}.</p><h3>${t('Conference reviewer','会议审稿')}</h3><p>${esc(data.academicService.conferences.join(', '))}.</p></section>`;
}
const outputs={};
for(const zh of [false,true]) for(const key of Object.keys(names)) {
 const t=(a,b)=>zh?b:a; const url=href(key,zh);
 const html=renderShell({key,zh,title:titles[key][+zh],content:body(key,zh),data});
 const publicHtml=html
  .replace('This first edition includes publications migrated from the previous website. See also','For more publications, see')
  .replace('首版收录旧主页已有论文，更多成果可参见','更多成果可参见')
  .replace(/<p class="subtle">(?:Updates below were migrated from the previous website\.|以下动态迁移自旧主页。)<\/p>/,'');
 outputs[url]=zh?publicHtml.replace(/href="(\/(?:publication|teaching)\/[^"#]+)"/g,'href="/zh$1"'):publicHtml;
}
// Preserve the original recruitment URL, plus its historic aliases.
for(const [file,url] of [['markdown.md','/markdown/'],['scholar-md.html','/md/'],['scholar-markdown.html','/markdown.html']]) {
 const target='/zh/joining/'; const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="https://andrewchiyz.github.io${target}"><title>招生说明</title></head><body><a href="${target}">招生说明 / Joining information →</a></body></html>`;
 outputs[url]=html;
}
fs.mkdirSync(path.join(root,'.preview'),{recursive:true});
// Full detail pages are static too: no framework runtime or legacy templates.
for(const [items,section] of [[data.papers,'publications'],[data.courses,'teaching']]) for(const item of items) for(const zh of [false,true]) {
 const url=(zh?'/zh':'')+item.permalink;
 const alternate=(!zh?'/zh':'')+item.permalink;
 const paragraphs=(item.abstract||(zh&&item.bodyZh?item.bodyZh:item.body)||'').split(/\n\s*\n/).map(s=>`<p>${esc(s)}</p>`).join('');
 const content=`<div class="eyebrow">${section.toUpperCase()}</div><h1>${esc(item.title)}</h1>${item.authors?`<p>${esc(item.authors)}</p>`:''}${item.venue?`<p class="page-lead">${esc(item.venue)} · ${item.year}</p>`:''}${item.abstract||item.body?`<section><h2>${zh?(item.abstract?'摘要（英文原文）':item.bodyZh?'课程介绍':'课程介绍（英文原文）'):(item.abstract?'Abstract':'Course description')}</h2>${paragraphs}</section>`:''}${item.url?`<p><a href="${esc(item.url)}">${item.url.includes('github.com/')?'Code':item.url.includes('github.io/')?'Project':'Paper'} ↗</a></p>`:''}${item.citation?`<section><h2>${zh?'引用':'Citation'}</h2><p>${esc(item.citation)}</p></section>`:''}<p><a href="${href(section,zh)}">← ${names[section][+zh]}</a></p>`;
 const detailContent=section==='teaching'?content.replace('</h1>',()=>'</h1>'+renderCoursePoster(item,zh)):content;
 outputs[url]=renderShell({key:section,zh,title:zh&&section==='teaching'&&item.titleZh?item.titleZh:item.title,content:detailContent,data,url,languageUrl:alternate,detail:true});
}
for(const [file,url,target] of [['scholar-about.html','/about/','/'],['scholar-about-html.html','/about.html','/'],['scholar-resume.html','/resume','/cv/']]) {
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><title>Yuzhu Ji</title><link rel="canonical" href="https://andrewchiyz.github.io${target}"></head><body><a href="${target}">Continue →</a></body></html>`;
 outputs[url]=html;
}
for(const zh of [false,true]) {
 const url=zh?'/zh/sitemap/':'/sitemap/';
 const content='<ul>'+Object.keys(names).map(key=>'<li><a href="'+href(key,zh)+'">'+esc(names[key][+zh])+'</a></li>').join('')+'</ul>';
 outputs[url]=renderShell({key:'home',zh,title:'Sitemap',content,data,url,languageUrl:zh?'/sitemap/':'/zh/sitemap/',detail:true});
}
for(const [url,html] of Object.entries(outputs)) {
 const rel=url.endsWith('.html')?url.slice(1):path.join(url.slice(1),'index.html');
 const destination=path.resolve(root,rel);
 if(!destination.startsWith(root+path.sep))throw new Error('Invalid output path');
 fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.writeFileSync(destination,html+'\n');
}
fs.writeFileSync(path.join(root,'.nojekyll'),'');
fs.writeFileSync(path.join(root,'404.html'),renderShell({key:'home',zh:false,title:'Page not found / 页面未找到',content:'<p><a href="/">English home →</a></p><p><a href="/zh/">中文首页 →</a></p>',data,url:'/404.html',languageUrl:'/zh/',detail:true})+'\n');
fs.writeFileSync(path.join(root,'.preview','routes.json'),JSON.stringify(outputs));
console.log(`Generated ${Object.keys(outputs).length} framework-free static pages.`);
