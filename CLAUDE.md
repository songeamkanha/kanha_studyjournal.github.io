# Kanha Study Journal — Project Guide

## Project Summary

Personal portfolio and study journal hosted on GitHub Pages. The core defect (all content in localStorage, invisible to visitors) is being fixed by migrating to committed Jekyll `_posts/*.md` files.

**Core Value:** Anyone can visit and read what Kanha is learning and building — posts are public, discoverable, and worth reading.

## Tech Stack

- **Site:** Vanilla HTML/CSS/JS (ES6+) — NO framework, NO bundler, NO npm in main repo
- **Hosting:** GitHub Pages with Jekyll (via `github-pages` gem, ~3.9.x)
- **Typography:** Lora (body) + Inter (UI) via Google Fonts CDN
- **Code highlighting:** highlight.js CDN (post pages only)
- **AI drafting:** `@anthropic-ai/sdk` (Node.js local CLI — never deployed)

## Critical Constraints

- **No framework, no build step** — keep deployment simple. CDN-only for all front-end dependencies.
- **Jekyll version:** Use `gem "github-pages"` in Gemfile. GitHub Pages runs Jekyll 3.9.x — do NOT use Jekyll 4.x.
- **No API keys in repo** — `.env` and `node_modules/` must be in `.gitignore` before any AI CLI code.
- **Jekyll-processed posts** (not JS-fetched) — commit to `_posts/`, use `_layouts/post.html`, Jekyll emits static HTML.

## Known Issues (fix in Phase 1)

- `index.md` + `index.html` coexist — remove `index.md` before any Jekyll build
- `DataManager.init()` double-init bug — diagnose before content migration
- `_config.yml` unfilled placeholders (`your_twitter_handle`, `Your Name`) — fix before enabling Jekyll plugins

## Post Frontmatter Schema

```yaml
---
title: "Post Title"
date: 2026-04-25
tags: [algorithms, cs-fundamentals]
excerpt: "One-sentence summary."
series: "Algorithms Deep Dive"   # optional
series_order: 2                  # optional
featured: false                  # optional
updated: 2026-05-01              # optional
---
```

## GSD Workflow

This project uses GSD for structured planning and execution.

**Current status:** Roadmap created. 24 requirements mapped across 4 phases.

| Phase | Status |
|-------|--------|
| 1 — Jekyll Foundation | Not started |
| 2 — Content Migration | Not started |
| 3 — UX Polish | Not started |
| 4 — AI Drafting Pipeline | Not started |

**Next:** `/gsd-plan-phase 1`

### Planning artifacts

- `.planning/PROJECT.md` — project context and decisions
- `.planning/REQUIREMENTS.md` — 24 v1 requirements with REQ-IDs
- `.planning/ROADMAP.md` — 4-phase roadmap
- `.planning/STATE.md` — current progress and blockers
- `.planning/research/` — domain research (stack, features, architecture, pitfalls)

### Workflow rules

- Run `/gsd-discuss-phase N` before planning a new phase
- Run `/gsd-plan-phase N` to create PLAN.md files for a phase
- Run `/gsd-execute-phase N` to implement a phase
- Commit planning docs to git (`commit_docs: true` in config)
