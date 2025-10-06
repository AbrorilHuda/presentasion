# GSAP Slide Deck

Features:

- Next.js 15 (App Router), React 19, TypeScript, Tailwind v4 tokens
- GSAP enter/exit animations with direction-aware transitions + stagger
- Dynamic routes /s/[index], keyboard/onscreen navigation, URL sync + back/forward
- Markdown slides via gray-matter + remark/rehype (sanitized)
- Presenter mode (/presenter) with next slide preview, notes, timer (N = notes, T = timer)
- Progress bar with mini-map, theme presets, print to PDF via /print

Run:

- Dev: bun run dev
- Build: bun run build && bun start
- Export PDF: open /print, then in browser Print… → Destination: Save as PDF, Layout: Landscape, Margins: None/0

Add slides:

- Markdown: add files to content/slides as `NN-name.md` with frontmatter fields: title, notes, bg, align, layout.
- The deck auto-sorts by filename number. Images go in public/images and reference as /images/..
