# “加入我们”Markdown 迁移样板

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

更改职称时，编辑 `profile.yml` 中的 `en.position` 和 `zh.position`；更改邮箱只需改一处 `email`。两个语言页面的侧边栏和正文联系链接都引用同一份配置。不要修改生成的 HTML。

## 样板范围

- 使用真实 Jekyll、Liquid 和 Kramdown，不再从 JavaScript 拼接招生正文。
- 中英文网址仍是 `/joining/` 与 `/zh/joining/`。
- 复用仓库现有 CSS、字体、图片和脚本，没有换用默认主题。
- 保留最新已提交 HTML 中的内容，包括直接修改过的段落和标题图标。
- 目前仅这两个页面使用新配置。其他页面仍由原系统维护，不会自动跟着样板配置变化。
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
node migration/tools/preview.mjs
```

打开：

- 中文：http://127.0.0.1:4174/zh/joining/
- 英文：http://127.0.0.1:4174/joining/

修改 Markdown 后重新执行构建命令并刷新。构建输出只写入被忽略的 `.preview/jekyll-site/`。预览服务器优先显示这两个新页面，其他网址及静态资源从现有网站目录读取，因此点到其他栏目时看到的是旧版本。

不要把 Jekyll 的 destination 设置为仓库根目录，它会清理输出目录。

## 分支检查与回退

`.github/workflows/jekyll-sample.yml` 只针对迁移分支构建、检查并保存预览产物，不部署 GitHub Pages，不写入任何分支。没有 `pages: write` 权限。

检查包括正文与 HTML 结构对比、原样式引用、两种语言，以及修改统一配置后邮箱和职称是否同步。第一次迁移要求内容与基线一致；之后有意修改正文时，需要相应更新比较基线或调整检查策略。

浏览器截图对比尚待在可用的预览浏览器中完成，结构对比不能替代最终视觉验收。

线上 `master` 与 `backup/pre-jekyll-2026-10-25` 保持不变。备份标签为 `pre-jekyll-migration-2026-10-25`，基线提交 `489298a`。
