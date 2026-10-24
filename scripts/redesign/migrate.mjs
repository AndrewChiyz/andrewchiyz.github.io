import fs from 'node:fs';
const read = p => fs.readFileSync(p,'utf8');
const field = (s,k) => {const v=s.match(new RegExp('^'+k+':\\s*(.*)$','m'))?.[1] || ''; return v.replace(/^['"]|['"]$/g,'').trim();};
const body = s => s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'').trim();
if(fs.existsSync('_data/scholar.json')) throw new Error('Migration already performed; edit scholar.json instead.');
const papers=fs.readdirSync('_publications').filter(f=>f.endsWith('.md')).map(f=>{
 const s=read('_publications/'+f), title=field(s,'title'), citation=field(s,'citation');
 const special=title.startsWith('CFNet');
 return {title,citation,permalink:field(s,'permalink'),venue:field(s,'venue'),url:field(s,'paperurl'),year:special?2023:2024,type:field(s,'category')==='manuscripts'?'journal':'conference',short:title.startsWith('CPNet')?'ECAI':title.startsWith('One-shot')?'TMM':special?'PRCV':'KDD',authors:title.startsWith('CPNet')?'Yuzhu Ji, Mingshan Sun, Yiqun Zhang, Haijun Zhang':title.startsWith('One-shot')?'Yuzhu Ji, Chuanxia Zheng, Tat-Jen Cham':special?'Shiting He, Yuzhu Ji, Yiqun Zhang, An Zeng, Dan Pan, Jing Lin, Xiaobo Zhang':'Junyang Chen, Yuzhu Ji, Rong Zou, Yiqun Zhang, Yiu-ming Cheung',selected:!special};
}).sort((a,b)=>b.year-a.year||a.title.localeCompare(b.title));
const courses=fs.readdirSync('_teaching').filter(f=>f.endsWith('.md')).map(f=>{const s=read('_teaching/'+f);return {title:field(s,'title'),permalink:field(s,'permalink'),body:body(s)};});
const data={email:'yuzhu.ji@gdut.edu.cn',scholar:'https://scholar.google.com/citations?user=EqHMEmMAAAAJ',dblp:'https://dblp.org/pid/169/2012.html',papers,courses,news:[
 {date:'2024.12',en:'Two papers accepted to ICASSP 2025.',zh:'两篇论文被 ICASSP 2025 录用。'},
 {date:'2024.11',en:'One paper accepted by IEEE Transactions on Multimedia.',zh:'一篇论文被 IEEE Transactions on Multimedia 录用。'},
 {date:'2024.09',en:'Two papers accepted to BIBM 2024. Congratulations to Qingsheng and Xiaopeng!',zh:'两篇论文被 BIBM 2024 录用，祝贺 Qingsheng 和 Xiaopeng！'},
 {date:'2024.07',en:'One paper accepted to ECAI 2024.',zh:'一篇论文被 ECAI 2024 录用。'},
 {date:'2024.05',en:'One paper accepted to SIGKDD 2024. Congratulations to Junyang!',zh:'一篇论文被 SIGKDD 2024 录用，祝贺 Junyang！'},
 {date:'2023.08',en:'Two papers accepted to PRCV 2023. Congratulations to Shiting!',zh:'两篇论文被 PRCV 2023 录用，祝贺 Shiting！'},
 {date:'2023.05',en:'One paper accepted to ECAI 2023. Congratulations to Zhipeng!',zh:'一篇论文被 ECAI 2023 录用，祝贺 Zhipeng！'}
],jobs:[
 {date:'2022.05',en:'Associate Professor',zh:'副教授',org:'Guangdong University of Technology',orgZh:'广东工业大学计算机学院'},
 {date:'2020.12',en:'Postdoctoral Research Fellow',zh:'博士后研究员',org:'Nanyang Technological University · Prof. Tat-Jen Cham',orgZh:'南洋理工大学 · Tat-Jen Cham 教授'},
 {date:'2019.10',en:'Research Assistant',zh:'研究助理',org:'Harbin Institute of Technology, Shenzhen · Prof. Haijun Zhang',orgZh:'哈尔滨工业大学（深圳）· 张海军教授'},
 {date:'2018',en:'Research Intern',zh:'研究实习生',org:'Tencent AI Lab · Dr. Zequn Jie & Dr. Lin Ma',orgZh:'腾讯 AI Lab · Zequn Jie 博士、Lin Ma 博士'}
],education:[
 {date:'2015.03 – 2019.10',en:'Ph.D.',zh:'博士',org:'Harbin Institute of Technology, Shenzhen',orgZh:'哈尔滨工业大学（深圳）'},
 {date:'2012.09 – 2014.12',en:'Master’s degree',zh:'硕士',org:'Harbin Institute of Technology, Shenzhen',orgZh:'哈尔滨工业大学（深圳）'},
 {date:'2007.09 – 2011.07',en:'Bachelor’s degree',zh:'学士',org:'PLA Information Engineering University, Zhengzhou',orgZh:'解放军信息工程大学，郑州'}
]};
fs.mkdirSync('docs/redesign',{recursive:true});
fs.writeFileSync('docs/redesign/original-content.json',JSON.stringify(Object.fromEntries(['_pages/about.md','_pages/cv.md','_pages/markdown.md'].map(p=>[p,read(p)])),null,2)+'\n');
fs.writeFileSync('_data/scholar.json',JSON.stringify(data,null,2)+'\n');
console.log('Migrated existing content; no new academic claims added.');
