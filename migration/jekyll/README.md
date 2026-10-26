# 学术主页 Markdown 迁移样板

这是独立样板，尚未替换线上网站。只在 `migration/jekyll-markdown` 分支工作；不要合并到备份分支。

## 日常编辑入口

| 想改什么 | 文件 |
| --- | --- |
| 中文招生正文、科研要求 | `_pages/joining/zh.md` |
| 英文招生正文、科研要求 | `_pages/joining/en.md` |
| 姓名、职称、单位、邮箱、照片、CV、学术链接 | `_data/profile.yml` |

正文中的 `##` 是章节标题，`**文字**` 是加粗，`-` 是列表。

例如，找到中文文件中的“关于入组做科研的特别说明”，直接修改下面的段落即可。红色侧边线由现有 CSS 控制，不需要自己写样式。

`<section ... markdown="1">`、`</section>` 与 `{% include ... %}` 是维持原布局的结构标记，修改正文时保留它们。为了第一阶段与现有页面保持一致，卡片、目录和特殊链接暂时放在 `_includes/` 中；后续可以继续把它们的配置提取出来。

更改职称时，编辑 `profile.yml` 中的 `en.position` 和 `zh.position`；更改邮箱只需改一处 `email`。所有已迁移页面的侧边栏和正文联系链接都引用同一份配置。不要修改生成的 HTML。

## 样板范围

- 使用真实 Jekyll、Liquid 和 Kramdown，不再从 JavaScript 拼接招生正文。
- 保留“加入我们”、教学列表和课程详情的所有原网址及中英文切换。
- 复用仓库现有 CSS、字体、图片和脚本，没有换用默认主题。
- 保留最新已提交 HTML 中的内容，包括直接修改过的段落和标题图标。
- 目前“加入我们”、教学列表及 6 门课程详情、论文列表及 32 篇论文详情的中英文页面、动态列表的中英文页面及报告页面及个人履历页面及首页（共 90 页）使用新配置。其他页面仍由原系统维护，不会自动跟着样板配置变化。
- 导航、页脚的内容及样式版本号暂时按迁移基线保留，后续全站迁移时再集中配置。
- 本地预览关闭第三方地图脚本，避免把测试访问记入真实统计；生成的 Jekyll 页面仍保留原地图组件。

## 构建与预览

需要 Ruby 3.3、Bundler 和 Node.js。以下命令在仓库根目录执行（PowerShell）：

```powershell
$env:BUNDLE_GEMFILE = "$PWD/migration/jekyll/Gemfile"
bundle install
bundle exec jekyll build --source migration/jekyll --destination .preview/jekyll-site --config migration/jekyll/_config.yml
npm.cmd install --prefix migration/tools --ignore-scripts
node migration/tools/check.mjs
node migration/tools/package-site.mjs
node migration/tools/check-routes.mjs
node migration/tools/preview.mjs
```

打开：

- 中文：http://127.0.0.1:4174/zh/joining/
- 英文：http://127.0.0.1:4174/joining/

修改 Markdown 后重新执行构建命令并刷新。构建输出只写入被忽略的 `.preview/jekyll-site/`。预览服务器优先显示已迁移页面，其他网址及静态资源从现有网站目录读取，因此点到其他栏目时看到的是旧版本。

不要把 Jekyll 的 destination 设置为仓库根目录，它会清理输出目录。

## 分支检查与回退

`.github/workflows/jekyll-sample.yml` 只针对迁移分支构建、检查并保存预览产物，不部署 GitHub Pages，不写入任何分支。没有 `pages: write` 权限。

检查包括正文与 HTML 结构对比、原样式引用、两种语言，以及修改统一配置后邮箱和职称是否同步。第一次迁移要求内容与基线一致；之后有意修改正文时，需要相应更新比较基线或调整检查策略。

浏览器截图对比尚待在可用的预览浏览器中完成，结构对比不能替代最终视觉验收。

线上 `master` 与 `backup/pre-jekyll-2026-10-25` 保持不变。备份标签为 `pre-jekyll-migration-2026-10-25`，基线提交 `489298a`。

## 教学内容怎么改

- 教学列表：[中文](http://127.0.0.1:4174/zh/teaching/) / [英文](http://127.0.0.1:4174/teaching/)。卡片可以点击进入 Markdown 生成的课程详情。
- 每门课的中英文名称和海报：`_data/courses/<课程ID>.yml`。同一课程在多个学年自动共用这份配置。
- 课程正文：`_courses/<课程ID>/zh.md` 和 `en.md`，直接写 Markdown，不需要 HTML 容器。现有未翻译的介绍仍按原页面保留英文，并保留“英文原文”提示。
- 开课年份、重复开课次数、当前授课状态：`_data/teaching_years.yml`。`current: true` 为红色正在授课，`offerings: 2` 表示同学年开课两次。无需填写学时。
- 教学页开头介绍：`_pages/teaching/zh.md`、`en.md`。
- 新增课程时复制一份课程资料和中英文正文，修改 ID、标题与网址，再将 ID 加入对应学年。

验证使用现有页面作为内容基线；公共侧边栏和页脚以最新“加入我们”页面为统一基线，统一了旧课程详情遗留的会员称谓差异。样板另含已确认的双栏布局修复 CSS。

## 发表论文怎么改

预览：[中文](http://127.0.0.1:4174/zh/publications/) / [英文](http://127.0.0.1:4174/publications/)。搜索、期刊/会议筛选和引用复制沿用原脚本。

每篇论文只有一个文件：`_papers/<论文ID>.md`。文件上方是 YAML 元数据，下面是 Markdown 摘要；英文论文摘要供两个语言的详情页共用，不重复保存。没有摘要就留空。

- `title`、`authors`、`venue`、`year`：论文信息。
- `type`：`journal` 或 `conference`，决定筛选类别。
- `short`：TMM、TNNLS 等列表徽标。
- `paper_url`：外部论文/代码/项目链接，暂无链接时填空字符串。
- `citation`：完整引用格式，两个语言共用；更新论文出版信息时同时核对这一字段。
- `order`：列表顺序，数字较小的在前，每篇保持唯一。
- `paper_id` 和 `detail_url`：稳定标识与旧网址；已有论文不随意改动。
- `selected`、`selectedOrder`：保留现有代表作选择，迁移版首页直接读取这些字段，精选论文按 selectedOrder 排列。

新增论文：复制已有 Markdown，填写新信息，设置唯一 ID、网址和顺序。Jekyll 的 `_plugins/paper_pages.rb` 自动生成中英文详情页，不需要另建两个页面。列表页开头说明在 `_pages/publications/zh.md`、`en.md`。

这个样板用自定义 Jekyll 生成器。当前迁移分支的构建流程已启用它；未来正式发布需要保留支持插件的构建流程，不能假定 GitHub Pages 的默认安全构建会加载自定义插件。当前没有修改线上发布配置。

## 动态怎么更新

预览：[中文](http://127.0.0.1:4174/zh/news/) / [英文](http://127.0.0.1:4174/news/)。

现有 21 条动态位于 `_news/`，每条一个 Markdown 文件。文件开头的 `month` 是显示日期（例如 `"2026.10"`），`order` 是排序数字（越小越靠前，保持唯一），`english` 是英文内容；下方正文是中文内容。两种语言均支持 `**加粗**`，每种语言保持一个段落。

新增动态时复制一份现有文件，修改日期和两种语言内容，并设置比现有最小值更小的 `order`，即可在列表顶部显示。文件名建议使用年月加编号，避免重复。列表页简介在 `_pages/news/en.md` 和 `zh.md`。迁移版首页会同步展示排序最靠前的 5 条动态。

## 报告页面怎么更新

报告内容直接编辑 `_pages/talks/zh.md` 和 `en.md`，分别对应中英文。标题、地点和介绍使用 Markdown；保留卡片外层的 `<article class="course" markdown="1">` 和 `</article>`，以及日期行的 `eyebrow` 样式。新增报告可复制整段卡片，放到现有报告之前。

本地预览：[中文](http://127.0.0.1:4174/zh/talks/) / [英文](http://127.0.0.1:4174/talks/)。

## 个人履历怎么更新

- 工作与教育经历：`_data/cv.yml`，每条的日期由中英文共用，`en`、`zh` 分别保存职位/学位和机构名称。数组顺序就是页面顺序，新增经历放在对应列表顶部。此处是履历历史记录，侧栏当前职位仍在 `profile.yml` 中维护。
- 科研项目、学术任职和学术服务：`_pages/cv/en.md`、`zh.md`，直接编辑 Markdown 正文。保留章节外层的 `section` 和时间线 include。
- 完整简历下载：修改 `_data/profile.yml` 的 `cv` 字段，侧栏与履历页共用此链接。

本地预览：[中文](http://127.0.0.1:4174/zh/cv/) / [英文](http://127.0.0.1:4174/cv/)。迁移保留现有正文，不改动原有任职或资助表述。

## 首页怎么更新

- 个人简介：`_pages/home/en.md`、`zh.md`，单段 Markdown，使用 `**重点**` 加粗。姓名、职位和单位等引用 `profile.yml`，修改时保留 Liquid 变量。详细经历、研究方向和成就仍需分别维护中英文表述。
- 招生提示和各区块标题也在首页 Markdown 中，保留现有链接及容器以维持布局。
- 最新动态：读取 `_news/`；首页 `news_limit: 5` 控制显示数量。与动态页内容统一，包括原先只在动态页更新的祝贺文字。
- 代表论文：读取 `_papers/` 中 `selected: true` 的记录，按 `selectedOrder` 排序；标题、作者、摘要入口、引用与论文页共享。
- 审稿服务：`_data/service.yml`，首页和个人履历共同引用。

本地预览：[中文首页](http://127.0.0.1:4174/zh/) / [英文首页](http://127.0.0.1:4174/)。当前仅迁移分支启用，线上旧版本仍不受影响。

## 迁移收尾状态

全部 99 个原有 HTML 地址已覆盖：90 个主要内容页、2 个网站地图、1 个 404 页面和 6 个旧网址跳转。此前章节关于“其他页面仍由旧系统维护”的说明已不适用于当前样板。预览只读取新生成的页面，找不到地址时返回新版 404（HTTP 404）；静态资源仍允许从仓库读取。

- 网站地图：`_pages/sitemap/en.md`、`zh.md`。
- 错误页：`_pages/404.md`，构建为 `/404.html`。
- 旧网址跳转：`_pages/redirects/`，`redirect_to` 指定目标，共用 `_layouts/redirect.html`。保留 `/about/`、`/about.html`、`/resume`、`/markdown/`、`/md/`、`/markdown.html`；目录入口同时支持末尾斜杠。使用静态 meta refresh 和可点击链接，不依赖服务器重定向配置。
- `package-site.mjs` 将 images、assets、files、licenses 合入构建目录，生成可独立预览的完整产物；保留迁移专用样式。
- `check-routes.mjs` 检查全部旧 HTML 路径、跳转及站内 href/src 资源。两个独立项目网站 vision.ohmt.rfnt 和 vision.medseg.cpnet 不属于本仓库，不检查其网络可用性。

仍未合并、未部署，未改变 GitHub Pages 配置。正式切换前仍需视觉验收及确认发布方式；现有自定义插件需由完整 Jekyll 构建运行。你的本地未提交内容编辑不会自动包含在远端构建中。
