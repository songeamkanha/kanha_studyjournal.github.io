# Roadmap: Kanha Study Journal

## Overview

Four phases close the single critical defect (localStorage-only content) and layer a low-friction publishing workflow on top. Phase 1 unblocks the Jekyll build pipeline. Phase 2 migrates all content into the repo where any visitor can see it. Phase 3 makes the site warm, readable, and personal. Phase 4 adds an AI drafting CLI so rough notes become publishable posts without touching layout code.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Jekyll Foundation** - Fix the Jekyll build pipeline so post commits can be deployed
- [x] **Phase 2: Content Migration** - Move all content from localStorage into committed files visible to every visitor
- [ ] **Phase 3: UX Polish** - Make the site warm, personal, and readable with proper typography, tags, and homepage content
- [ ] **Phase 4: AI Drafting Pipeline** - Add a local CLI so rough notes become reviewable markdown posts without touching site code

## Phase Details

### Phase 1: Jekyll Foundation
**Goal**: The Jekyll build pipeline processes `_posts/*.md` files and deploys without errors
**Slug**: `01-jekyll-foundation`
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04
**Success Criteria** (what must be TRUE):
  1. A test post committed to `_posts/` renders as a routed HTML page on the live GitHub Pages site
  2. `_config.yml` contains no unfilled placeholders (`your_twitter_handle`, `Your Name` replaced) and `jekyll-feed`, `jekyll-seo-tag`, `jekyll-sitemap` plugins are active
  3. `index.md` is removed and the Jekyll build produces no conflicts with `index.html`
  4. `DataManager.init()` double-init bug is diagnosed and patched before any content migration begins
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Fix _config.yml, remove index.md, enable plugins
- [x] 01-02-PLAN.md — Create _layouts/post.html and test post
- [x] 01-03-PLAN.md — Patch DataManager double-init bug

### Phase 2: Content Migration
**Goal**: All blog posts and portfolio items live in committed files that any visitor can read
**Slug**: `02-content-migration`
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. A visitor who has never used the site can load the blog index and see all posts (not an empty page)
  2. All existing posts are committed as `_posts/*.md` files with a consistent frontmatter schema (`title`, `date`, `tags`, `excerpt` required)
  3. Portfolio items are stored in `_data/portfolio.yml` and render on the portfolio page for any visitor
  4. The localStorage-backed admin panel is retired and no longer used for content creation
**Plans**: 4 plans

Plans:
- [ ] 02-01-PLAN.md — Create seed post and _data/portfolio.yml
- [ ] 02-02-PLAN.md — Rewrite blog/index.html and portfolio/index.html as Jekyll Liquid templates
- [ ] 02-03-PLAN.md — Rewrite index.html homepage with Jekyll Liquid post and portfolio loops
- [ ] 02-04-PLAN.md — Delete admin panel, content-loader.js, data-manager.js, and old post viewer files

### Phase 3: UX Polish
**Goal**: The site is warm, personal, and readable — typography, tags, homepage, and post features all work
**Slug**: `03-ux-polish`
**Depends on**: Phase 2
**Requirements**: UX-01, UX-02, UX-03, UX-04, HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, POST-01, POST-02, POST-03
**Success Criteria** (what must be TRUE):
  1. The homepage shows a real bio, the latest 3-5 posts with excerpts, a portfolio preview, a "currently learning" blurb, and a featured posts section
  2. Blog post cards display tags and a reading-time estimate; clicking a tag filters the blog index to posts with that tag
  3. Code blocks in posts render with syntax highlighting (loaded only on post pages)
  4. Post pages using `series` + `series_order` frontmatter show prev/next series navigation links
  5. The site typography uses Lora (body) and Inter (UI) with a warm off-white palette applied via CSS custom properties
**Plans**: TBD
**UI hint**: yes

### Phase 4: AI Drafting Pipeline
**Goal**: A local CLI takes rough notes, calls Claude, and writes a reviewed `.md` file ready to commit
**Slug**: `04-ai-drafting-pipeline`
**Depends on**: Phase 2
**Requirements**: AI-01, AI-02, AI-03, AI-04
**Success Criteria** (what must be TRUE):
  1. Running `node scripts/draft.mjs` with rough notes as input produces a formatted `.md` file written to `_posts/` for user review before any commit
  2. The CLI uses a `scripts/VOICE_GUIDE.md` as the Claude system prompt so output preserves Kanha's writing voice
  3. `.env` and `node_modules/` are in `.gitignore` before the first line of CLI code is committed; no API key exists anywhere in the repository history
  4. The publish workflow is documented end-to-end: write notes → run CLI → review + edit → commit `.md` → push to deploy
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Jekyll Foundation | 3/3 | Complete ✓ | 2026-05-09 |
| 2. Content Migration | 4/4 | Complete ✓ | 2026-05-14 |
| 3. UX Polish | 0/TBD | Not started | - |
| 4. AI Drafting Pipeline | 0/TBD | Not started | - |
