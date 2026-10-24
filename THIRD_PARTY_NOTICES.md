# Third-party theme and font notices

This website adapts the MIT-licensed AcademicPages / Minimal Mistakes theme and the layout and custom styling from Mengke Li's public academic website:

- Repository: https://github.com/keke921/keke921.github.io
- Website: https://keke921.github.io/
- Upstream license: `licenses/theme-MIT.txt` (Michael Rose, 2016).
- Files copied unchanged: `assets/css/reference/main.css` and `assets/css/reference/custom-theme.css`.
- Layout adaptation: `scripts/redesign/theme.mjs` uses the upstream masthead, author profile, article and footer structures.
- Retrieved on 2026-10-24. The upstream repository's MIT license is retained verbatim.

Font Awesome webfonts included by the upstream compiled stylesheet are stored locally in `assets/css/webfonts/`. Their font/code licenses and attribution are retained in `licenses/font-awesome-LICENSE.txt` (SIL OFL for fonts, MIT for code; see that file).

All personal biography, publications, courses, contact information, photos, and news displayed on the adapted site belong to Yuzhu Ji and were migrated from his existing homepage. No reference-site biography, student list, research claims, analytics code, or personal images are included.

Zhang Yiqun's homepage remains an information-architecture reference; its source or stylesheet is not included in this version.

## Text fonts

- Source Sans 3 (Adobe), Latin variable subset, obtained from Google Fonts. SIL Open Font License retained at `licenses/source-sans3-OFL.txt`.
- Noto Sans SC, variable subset containing the Chinese characters used by the site, obtained from Google Fonts. SIL Open Font License retained at `licenses/noto-sans-sc-OFL.txt`.
- WOFF2 files are self-hosted in `assets/fonts/`; visitors do not contact a third-party font service. `font-display: swap` retains readable system-font fallback.
- To refresh the Chinese subset after content changes: run `npm run build:site`, then `node scripts/update-fonts.mjs`. This optional maintenance command needs network access; ordinary page builds do not.
