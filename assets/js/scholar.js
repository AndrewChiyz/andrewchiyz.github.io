const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  document.getElementById('navigation').classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelectorAll('details[open]').forEach(el => el.open = false);
    menu?.setAttribute('aria-expanded', 'false');
    document.getElementById('navigation')?.classList.remove('open');
  }
});
let filter = 'all';
const input = document.getElementById('paper-search');
function updatePapers() {
  const query = input?.value.trim().toLowerCase() || '';
  let count = 0;
  document.querySelectorAll('[data-paper]').forEach(paper => {
    const show = (filter === 'all' || paper.dataset.type === filter) && paper.dataset.search.toLowerCase().includes(query);
    paper.hidden = !show;
    if (show) count++;
  });
  const counter = document.getElementById('result-count');
  if (counter) counter.textContent = document.documentElement.lang === 'zh-CN' ? `显示 ${count} 篇论文` : `${count} publications`;
  const empty = document.getElementById('empty-results');
  if (empty) empty.hidden = count > 0;
}
input?.addEventListener('input', updatePapers);
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  updatePapers();
}));
if (input) updatePapers();
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(button.previousElementSibling.textContent); button.textContent = document.documentElement.lang === 'zh-CN' ? '已复制' : 'Copied'; }
  catch { button.textContent = document.documentElement.lang === 'zh-CN' ? '请选中上方引用并复制' : 'Select the citation above to copy'; }
}));

// Count production page views only; the widget never delays page rendering.
if (location.hostname === "andrewchiyz.github.io") {
  const counterScript = document.createElement("script");
  counterScript.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
  counterScript.async = true;
  document.body.appendChild(counterScript);
}
