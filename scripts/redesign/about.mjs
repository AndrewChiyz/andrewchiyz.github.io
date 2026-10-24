const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderAbout(data,zh) {
 const membership=zh?'现为中国计算机学会、中国图象图形学学会会员，并担任广州计算机学会理事。':'I am also a member of the China Computer Federation (CCF) and the China Society of Image and Graphics (CSIG), and a council member of the Guangzhou Computer Society.';
 const text=[...data.biography[zh?'zh':'en'],membership].join(zh?'':' ');
 const emphasis=zh?[
  '青年百人 A 类副教授、硕士生导师','IEEE 高级会员',
  '计算机视觉','视频分析与合成','人体动作迁移','物体位姿估计','显著性物体检测','医学图像分割',
  '40 余篇','多项发明专利','主持国家级、省部级科研项目 4 项','广州计算机学会理事'
 ]:[
  "Associate Professor and master's supervisor",'Senior Member of IEEE',
  'computer vision','video analysis and synthesis','human motion transfer','object pose estimation','salient object detection','medical image segmentation',
  'over 40 papers','multiple invention patent applications','four national and provincial/ministerial research projects','council member of the Guangzhou Computer Society'
 ];
 let html=esc(text);
 for(const phrase of emphasis)html=html.replaceAll(esc(phrase),`<strong>${esc(phrase)}</strong>`);
 const href=zh?'/zh/joining/':'/joining/';
 return `<div class="home-intro"><p class="intro">${html}</p></div><aside class="home-highlight recruitment-callout" aria-label="${zh?'课题组招募':'Join our group'}"><span class="recruitment-icon" aria-hidden="true">📢</span><p>${zh?'<strong>欢迎对上述研究方向感兴趣的同学加入课题组！</strong>硕士申请者（含推免生）及本科科研生可发送简历联系，详情请访问':'<strong>We welcome students interested in these research directions to join our group.</strong> Prospective master’s students (including recommendation-based admission applicants) and undergraduate researchers may send a CV. For details, visit'} <a href="${href}"><strong>${zh?'Join Us / 加入我们':'Join Us'}</strong> →</a>${zh?'。':'.'}</p></aside>`;
}
