# Yuzhu Ji · Academic website

独立静态学术主页。原生 HTML / CSS / JavaScript，无 Jekyll、Ruby、第三方运行依赖。页面正文直接输出到 HTML，搜索引擎和关闭 JavaScript 的浏览器仍可阅读。参考学术主页的侧栏、摘要首页和双语分页组织，未引入或复制其他站点的主题代码。

## 开发

需要 Node.js 18+，无需 npm install。

```sh
npm run build:site
npm run check:site
npm run preview:site
```

访问 http://127.0.0.1:4173，中文首页为 `/zh/`。预览读取实际发布文件，包括论文和课程详情，未知地址返回自定义 404。修改内容或样式后重新构建并刷新。

## 文件

```text
content/scholar.json       论文（含摘要）、动态、课程、教育和工作经历
scripts/redesign/         页面生成、完整本地预览、验证
assets/css/scholar.css    新版布局与字体
assets/js/scholar.js      菜单、论文筛选和引用复制
index.html               英文首页（生成结果）
zh/                      中文首页与分页（生成结果）
publications/ 等          英文栏目（生成结果）
publication/、teaching/   论文与课程详情（生成结果）
images/、files/           旧站提取的图片及附件，待按内容逐步整理
docs/redesign/            维护与资料核对说明
```

双语正文及共享模板在 `scripts/redesign/build.mjs`。修改数据和模板后执行 build；提交时包含生成结果。无需在 GitHub 安装 Node 或新增工作流。

## 分支与上线

- `master` 保持旧版；`legacy-v1` 和 `legacy-2026-10-24` 是旧源码快照。
- 新版仅在 `redesign` 分支开发，备份分支和标签当前也仅在本地。
- `.nojekyll` 使 GitHub Pages 分支发布直接提供静态 HTML，不执行 Jekyll。无需修改原网址、发布分支或仓库设置。
- 尚未推送、合并、上线。上线前核对原 Pages 发布来源；如果确实是原分支根目录发布，将新版合入原发布分支即可。当前未读取远程 Pages 设置，不把这一前提视为已验证。
- 根目录中的源码和资料均可能在静态发布后公开，勿放入私人信息。原资料来自原公开网站。
- 回退用旧标签恢复文件并形成普通提交，不强推、不重写历史。

既有论文、课程、PDF 地址继续兼容；旧招生、about、resume 入口保留跳转。兼容链接无需旧框架。

## 验证

检查实际 HTML 输出、所有本地链接、双语对应、静态详情、元信息与可重复生成。无 Ruby/Jekyll 验证步骤。浏览器视觉验证仍需可用的浏览器连接。
