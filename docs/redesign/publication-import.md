# Google Scholar 论文导入

2026-10-24 自动访问目标主页返回 HTTP 403，本地网络连接亦超时。DBLP 两个官方站点的作者 XML 返回验证码页面，未提取记录，未绕过验证码。之后作者提供 `local/mypapers.bib`，实际导入使用该文件：32 条记录，新增 28 条、更新 4 条，分为 19 篇期刊和 13 篇会议。该文件包含 DBLP 等格式并经作者编辑，来源标记为 Author-provided BibTeX，不宣称为 Scholar 自动抓取。

目标主页：https://scholar.google.com/citations?user=EqHMEmMAAAAJ&hl=en

## 由本人导出

在 Google Scholar 主页加载完整论文列表，勾选论文后选择 Export → BibTeX 或 CSV。注意确认选中的是全部论文，而不只是当前显示的前 20 条。

导出文件无需上传 GitHub，也不需要账号、密码或 Cookie。

```sh
# 先预览新增、更新、重复记录数量，不修改数据
node scripts/import-publications.mjs path/to/scholar.bib

# 核对后导入（CSV 同样支持）
node scripts/import-publications.mjs path/to/scholar.bib --apply
npm run build:site
npm run check:site
```

导入保留现有摘要、项目链接、代表作选择和旧论文地址；按规范化题名匹配，重复输入跳过，缺失年份的新记录拒绝导入。每条导入记录标注 Scholar 导出来源。期刊与会议版本题名不同时保留为独立记录；同名但确实不同的论文需要人工复核。

不要把未经作者确认的同名学者记录、搜索摘要或来源不明的引用次数写入论文列表。没有提供摘要的记录不能生成虚构摘要。

解析检查：`node --test scripts/import-publications.test.mjs`。
