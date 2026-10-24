const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderJoining(data,zh) {
 const t=(en,cn)=>zh?cn:en;
 const list=items=>`<ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
 return `<div class="joining-page">
<p class="page-lead">${t('Interested in computer vision or machine learning? I welcome enquiries from prospective master’s students, including recommendation-based admission applicants, and undergraduate students interested in research.','如果你对计算机视觉、机器学习感兴趣，想进一步了解我们在做什么，欢迎给我写信。无论是准备读研的同学（含推免生），还是希望尝试科研的本科生，都很欢迎联系交流。')}</p>
<p>${t('Our research includes video analysis and synthesis, human motion transfer, 6D pose estimation, salient object detection, and medical image segmentation. I hope you can find a topic that interests you and develop the skills to explore it independently.','我们的研究主要涉及视频分析与合成、人体动作迁移、物体位姿估计、显著性物体检测和医学图像分割等方向。希望同学们能在这里找到自己感兴趣的问题，在阅读、实验和讨论中逐步形成独立思考与研究的能力。')}</p>
<div class="joining-audience"><a href="#masters"><strong>${t('Master’s students','硕士研究生')}</strong><span>${t('Academic and professional programmes, including recommendation-based admission','学术型、专业型硕士，含推免生')}</span></a><a href="#undergraduates"><strong>${t('Undergraduate students','本科科研生')}</strong><span>${t('An opportunity to explore research through practice','从论文阅读与实验实践开始了解科研')}</span></a></div>
<p><a class="email-link" href="mailto:${esc(data.email)}">${t('Get in touch','欢迎联系')} · ${esc(data.email)} ↗</a></p>
<nav class="contents" aria-label="${t('On this page','本页目录')}"><a href="#masters">${t('Master’s students','硕士同学')}</a><a href="#undergraduates">${t('Undergraduates','本科同学')}</a><a href="#requirements">${t('Preparation','基础准备')}</a><a href="#research">${t('Research life','科研与交流')}</a><a href="#apply">${t('Contact','如何联系')}</a><a href="#experience">${t('Getting started','入组交流')}</a><a href="#admissions">${t('Admissions enquiries','招生信息')}</a></nav>

<section id="masters"><h2>${t('Master’s students','硕士研究生（含推免生）')}</h2>
<p>${t('If you are applying to an academic or professional master’s programme at the GDUT School of Computer Science and Technology, you are welcome to email me your CV. This includes applicants using recommendation-based admission. It would be helpful to hear about your interests and what you hope to learn during your master’s studies.','欢迎有意报考广东工业大学计算机学院的同学提前发来简历，推免生也可以直接邮件联系。你可以聊聊自己的学习经历、感兴趣的方向，以及对研究生阶段的期待。无论今后打算继续读博，还是从事研发工作，都希望你能在读研期间认真做一些研究，积累扎实的能力。')}</p>
<p>${t('The group focuses on academic research, with an emphasis on careful experiments and strong papers. Research takes sustained effort, so please consider how this fits with your own goals. We can discuss these expectations when we meet.','组内以学术研究为主，对实验的严谨性和论文质量有较高要求。科研需要持续投入，也常常会遇到反复尝试的过程。希望这样的学习方式与你的规划相符；具体的研究方向和培养安排，我们可以在交流时进一步讨论。')}</p></section>

<section id="undergraduates"><h2>${t('Undergraduate students interested in research','想尝试科研的本科同学')}</h2>
<p>${t('I welcome first- to third-year students at the GDUT School of Computer Science who are curious about research, especially those considering further study. Previous research experience is not required to get in touch; you can tell me what you have studied, tried, or would like to explore.','欢迎计算机学院一至三年级、对科研有兴趣的同学联系，尤其是有继续深造打算的同学。暂时没有科研经历也不用担心，可以先介绍自己学过的课程、做过的小项目，或者想了解的问题。')}</p>
<p>${t('Coursework remains important. I hope you can plan your time realistically and take part in research consistently alongside your studies. An initial conversation and a small research task can help us understand whether the topic and working style are a good fit.','对本科同学来说，课程学习同样重要。希望你能结合自己的时间安排，在兼顾学业的同时保持相对稳定的科研投入。正式入组前，我们可以先聊一聊，再通过一段论文阅读或实验体验，看看研究方向和组内的交流方式是否适合你。')}</p></section>

<section id="requirements"><h2>${t('Useful preparation','希望你具备的基础')}</h2>
<p>${t('A foundation in the following areas will make it easier to get started. You do not need to have mastered everything before contacting me; areas you are still learning can be part of our initial discussion.','有一些数学和编程基础，会让后续的研究更容易上手。不要求大家在联系时就熟悉所有内容；如果某些知识还没有学过，也可以在交流时说明，提前做些准备。')}</p>
${list([
 t('<strong>Mathematics:</strong> linear algebra, probability, and statistics.','<strong>数学：</strong>线性代数、概率论与数理统计。'),
 t('<strong>Machine learning:</strong> introductory machine learning and deep learning, through coursework or self-study.','<strong>专业知识：</strong>机器学习、深度学习的基本概念与方法。'),
 t('<strong>Programming:</strong> an interest in understanding research code, running experiments, and working through implementation problems.','<strong>编程：</strong>愿意动手写代码、阅读已有实现，并尝试解决实验中遇到的问题。'),
 t('<strong>Communication:</strong> a willingness to ask questions, share progress, and explain both your ideas and difficulties.','<strong>交流：</strong>愿意主动提问、分享进展，也能坦诚地说出自己的想法和困难。')
 ])}
<p>${t('For a starting point, you could look at Zhi-Hua Zhou’s Machine Learning textbook, Andrew Ng’s machine learning courses, Gilbert Strang’s linear algebra courses, or Stanford’s','准备时可以参考周志华的《机器学习》、吴恩达的机器学习课程、Gilbert Strang 的线性代数课程，以及斯坦福大学的')} <a href="https://cs231n.github.io/">CS231n</a>${zh?'。':'.'}</p></section>

<section id="research"><h2>${t('Research and discussion in the group','组里的科研与交流')}</h2>
<p>${t('We usually meet each week to discuss papers or research progress, with slides to help explain the work. Please bring questions as well as results: what you have tried, where you are stuck, and what you think might be worth trying next.','组里通常每周会有论文分享或进度交流，同学们会用 PPT 介绍最近的阅读和实验。除了已经做出的结果，也很欢迎大家把问题带来讨论：尝试过什么、卡在哪里、下一步有什么想法，都是值得交流的内容。')}</p>
<p>${t('We work towards high-quality papers while developing skills in reading, implementation, experimental analysis, writing, and presentation. Where there are suitable research outcomes, we may also pursue invention patents or research-oriented student competitions.','我们以高质量论文为主要研究目标，同时也重视阅读、编程、实验分析、学术写作和表达能力的积累。有合适的科研成果时，也可以进一步申请发明专利，或参加相关科研竞赛。希望经过一段时间的学习，你能够更清楚地提出问题、验证想法，并形成自己的判断。')}</p></section>

<section id="apply"><h2>${t('How to get in touch','如何联系我')}</h2>
<p>${t('Please email a CV and a short introduction. The first email does not need to be long; the following information will help me get to know you. Recommendation-based admission applicants are welcome to contact me in the same way.','欢迎把简历发到下面的邮箱。第一封邮件不必写得很长，简单介绍自己，并附上以下信息就好。推免生也可以通过同样的方式联系。')}</p>
<ol><li>${t('<strong>A CV:</strong> your university, degree programme, relevant coursework, and English proficiency results where applicable.','<strong>个人简历：</strong>包括学校、专业、相关课程学习情况及英语四六级成绩（如有）。')}</li>
<li>${t('<strong>Projects or research:</strong> work you have taken part in and what you contributed. If you have not yet done research, coursework or personal projects are also useful to hear about.','<strong>项目或科研经历：</strong>做过哪些事情、自己承担了什么工作。如果还没有科研经历，课程项目或自己动手做过的尝试也可以介绍。')}</li>
<li>${t('<strong>Your interests and plans:</strong> topics you would like to explore and your thoughts about further study or a research career.','<strong>兴趣与打算：</strong>想了解哪些研究方向，以及对读研、读博或未来工作的初步想法。')}</li></ol>
<p>${t('To make your email easier to find, a subject such as the following would be helpful','为了方便查找，邮件主题可以写成')}${zh?'：':': '}<strong>${t('Master’s / Undergraduate Research — Name — University','硕士申请 / 本科科研 — 姓名 — 学校')}</strong>${zh?'。':'.'}</p>
<a class="email-link" href="mailto:${esc(data.email)}">${esc(data.email)} ↗</a></section>

<section id="experience"><h2>${t('An initial conversation and research experience','联系之后，我们可以怎样进一步了解')}</h2>
<p>${t('After an initial exchange, we can arrange a conversation online or in person about your interests and plans. If there is a suitable topic, we may use a paper discussion or a small reproduction exercise to explore it further.','初步了解后，我们可以约一次线上或当面交流，聊聊你的兴趣和计划。如果有适合的方向，再通过一次论文分享或小实验进一步了解。你也可以借这个过程感受一下，自己是否喜欢这样的研究和交流方式。')}</p>
<div class="joining-tasks"><article><h3>${t('Read and discuss a paper','读一篇论文，聊聊自己的理解')}</h3>
<p>${t('We can choose a paper together or discuss one you are interested in. A 10–15 minute presentation is a useful starting point: what problem does it address, how does the method work, what do the experiments show, and what questions do you have?','可以读一篇我们商量好的论文，也可以选择你感兴趣的工作，准备约 10–15 分钟的分享。试着讲清楚它研究了什么问题、方法为什么有效、实验说明了什么，也欢迎提出你自己的疑问和想法。')}</p></article>
<article><h3>${t('Try an experiment','动手做一个实验')}</h3>
<p>${t('You can try running an existing implementation or reproducing an experiment, then walk me through your approach and observations. Problems encountered along the way are useful discussion points too.','尝试运行论文代码或复现其中的实验，记录自己的思路、观察到的现象，以及遇到的问题。交流时可以结合代码和结果来讲，也不必回避没有跑通或还没想明白的地方。')}</p></article></div>
<p>${t('A preparation period of about a week is typical, with the task and timing discussed beforehand. These are research conversations to help us get to know each other; formal admissions arrangements remain subject to university and school notices.','通常会留出一周左右的准备时间，具体内容和节奏可以在交流时商量。这些交流主要帮助我们了解彼此的科研兴趣与想法，学校正式的招生考核仍以相关通知为准。')}</p></section>

<section id="admissions"><h2>${t('Where to find admissions information','关于招生政策、面试与名额')}</h2>
<aside class="home-highlight admissions-notice"><p>${t('For recommendation-based admission interviews, entrance examinations and subsequent admission interviews, as well as admission and transfer quotas, please refer to the official announcements from the university and the school. You may find the information you need on the official pages below and official university accounts, or by contacting the school’s graduate program secretary.','关于推免面试、考研初试与复试安排，以及招生和调剂名额等事项，请以学校和学院的官方通知为准。建议同学们关注下方的官方页面及公众号，也可以向学院研究生秘书咨询。')}</p>
<div class="admissions-links"><a href="https://yzw.gdut.edu.cn/index.htm">${t('GDUT Graduate Admissions','广东工业大学研究生招生信息网')} ↗</a><a href="https://cs.gdut.edu.cn/index.htm">${t('School of Computer Science and Technology','广东工业大学计算机学院官网')} ↗</a></div></aside></section>
</div>`;
}
