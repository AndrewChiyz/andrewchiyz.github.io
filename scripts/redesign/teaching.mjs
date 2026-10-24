const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderTeaching(data,zh) {
 const t=(en,cn)=>zh?cn:en;
 const courseIndex=new Map(data.courses.map(c=>[c.id,c]));
 const years=data.teachingYears;
 return `<p class="page-lead">${t('Teaching at Guangdong University of Technology, organized by academic year.','广东工业大学课程教学，按学年归档。')}</p><nav class="teaching-years" aria-label="${t('Academic years','学年导航')}">${years.map(y=>`<a ${y.current?'class="is-current" ':''}href="#year-${y.year}">${esc(y.year.replace('-','–'))}</a>`).join('')}</nav><div class="teaching-archive">${years.map(y=>`<section class="teaching-year${y.current?' is-current':''}" aria-labelledby="year-${y.year}"><h2 class="teaching-archive__year" id="year-${y.year}">${esc(y.year.replace('-','–'))}${zh?' 学年':' Academic Year'}${y.current?` <span class="current-teaching-label">${t('Currently teaching','正在授课')}</span>`:''}</h2><div class="teaching-archive__grid">${y.courses.map(entry=>{
 const course=courseIndex.get(entry.id);if(!course)throw new Error('Unknown teaching course: '+entry.id);
 const href=(zh?'/zh':'')+course.permalink;
 return `<div class="teaching-archive__item${y.current?' teaching-archive__item--active':''}" data-course="${esc(entry.id)}" data-offerings="${entry.offerings||1}"><article class="archive__item">${y.current||entry.offerings>1?`<div class="teaching-card__meta">${y.current?`<span class="teaching-card__type">${t('Currently teaching','正在授课')}</span>`:''}${entry.offerings>1?`<span class="teaching-card__repeat">${zh?`开课 ${entry.offerings} 次`:`${entry.offerings} offerings`}</span>`:''}</div>`:''}<h3 class="archive__item-title"><a href="${href}">${esc(zh?course.titleZh:course.title)}</a></h3><p class="teaching-card__school">${t('Guangdong University of Technology','广东工业大学')}</p><a class="teaching-card__link" href="${href}">${t('Course details','课程介绍')} <span aria-hidden="true">→</span></a></article></div>`;
 }).join('')}</div></section>`).join('')}</div>`;
}
