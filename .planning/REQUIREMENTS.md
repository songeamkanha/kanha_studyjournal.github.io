# Requirements: Kanha Study Journal

**Defined:** 2026-04-26
**Core Value:** Anyone can visit and read what Kanha is learning and building — posts are public, discoverable, and worth reading.

## v1 Requirements

Requirements for initial release. Each maps to a roadmap phase.

### Infrastructure

- [ ] **INFRA-01**: `_layouts/post.html` exists and Jekyll post pipeline processes `_posts/*.md` files into routed HTML pages
- [ ] **INFRA-02**: `_config.yml` has no unfilled placeholders (`your_twitter_handle`, `Your Name` resolved); `jekyll-feed`, `jekyll-seo-tag`, and `jekyll-sitemap` plugins enabled
- [ ] **INFRA-03**: `index.md` removed so it no longer conflicts with `index.html` during Jekyll build
- [ ] **INFRA-04**: `DataManager.init()` double-init bug diagnosed and fixed before any content migration begins

### Content Migration

- [ ] **CONT-01**: Post frontmatter schema defined: `title`, `date`, `tags`, `excerpt` (required); `series`, `series_order`, `featured`, `updated` (optional) — schema documented and used by all committed posts
- [ ] **CONT-02**: All existing blog posts migrated from localStorage to `_posts/*.md` committed files — publicly visible to any visitor
- [ ] **CONT-03**: Portfolio items migrated from localStorage to `_data/portfolio.yml` committed data — publicly visible
- [ ] **CONT-04**: Admin panel retired after migration — localStorage-backed admin no longer used; no new admin panel needed

### Design / UX

- [ ] **UX-01**: Warm typography applied site-wide: Lora (body) + Inter (UI) via Google Fonts CDN; warm off-white base palette set via CSS custom properties
- [ ] **UX-02**: Syntax highlighting via highlight.js CDN loaded only on post pages
- [ ] **UX-03**: Tags displayed on post cards throughout the blog index; blog index has client-side tag filter
- [ ] **UX-04**: Reading time displayed on post cards and in the post header (`Math.ceil(wordCount / 200)` minutes read)

### Homepage

- [ ] **HOME-01**: Homepage has a real bio section identifying who Kanha is and what the site is
- [ ] **HOME-02**: Homepage shows the latest 3–5 blog posts with title, date, and excerpt
- [ ] **HOME-03**: Homepage has a portfolio preview section with project cards (title, description, tech stack, repo/demo links)
- [ ] **HOME-04**: Homepage shows a "currently learning" blurb sourced from `_data/now.json`
- [ ] **HOME-05**: Posts with `featured: true` frontmatter are surfaced in a dedicated homepage section

### Post Features

- [ ] **POST-01**: Post series navigation renders prev/next links in the post layout when both `series` and `series_order` frontmatter fields are present
- [ ] **POST-02**: "Last updated" timestamp is displayed on posts when an `updated` frontmatter field is present and differs from `date`
- [ ] **POST-03**: `featured: true` frontmatter field is queryable by the homepage and blog index to surface pinned content

### AI Pipeline

- [ ] **AI-01**: Local drafting CLI (`scripts/draft.mjs`) accepts rough notes as input, calls Claude API, and writes a formatted `.md` file to `_posts/` for user review
- [ ] **AI-02**: Voice and style guide document (`scripts/VOICE_GUIDE.md`) used as the Claude system prompt to preserve Kanha's writing style
- [ ] **AI-03**: `.gitignore` covers `.env` and `node_modules/` before any CLI code is committed; no API key ever touches the repository
- [ ] **AI-04**: Publish workflow documented: write rough notes → run CLI → review + edit output → commit `.md` → push to deploy

---

## v2 Requirements

Deferred to a future release. Tracked but not in the current roadmap.

### Discovery

- **DISC-01**: RSS feed via `jekyll-feed` plugin (add after 10+ posts are live)
- **DISC-02**: Full-text search (Pagefind) (add after 50+ posts)
- **DISC-03**: Newsletter / email subscriptions (add after 20+ posts with consistent cadence)

### Social

- **SOCL-01**: Comment system (Giscus or similar) — add after posting cadence is established

---

## Out of Scope

Explicitly excluded from v1 and v2. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Reader authentication | Site is fully public — no login needed |
| Custom domain | Can be added later without any code changes |
| Auto-publish without review | User explicitly chose manual review of every AI-drafted post |
| Comments (v1) | Moderation overhead; add after cadence is established |
| Public view counters | Requires backend or third-party service; use private analytics only |
| Social sharing buttons | Rarely used; one "copy link" button is sufficient |
| Web-based admin panel (post-migration) | Architecturally incompatible with committed-files model |
| Dark mode toggle | Use `@media (prefers-color-scheme: dark)` only — zero JS, zero state |
| Server-side pagination | Client-side filtering is fast enough at <100 posts |
| React / Vue / any framework | No build step desired; adds deployment complexity for no gain |

---

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 — Jekyll Foundation | Pending |
| INFRA-02 | Phase 1 — Jekyll Foundation | Pending |
| INFRA-03 | Phase 1 — Jekyll Foundation | Pending |
| INFRA-04 | Phase 1 — Jekyll Foundation | Pending |
| CONT-01 | Phase 2 — Content Migration | Pending |
| CONT-02 | Phase 2 — Content Migration | Pending |
| CONT-03 | Phase 2 — Content Migration | Pending |
| CONT-04 | Phase 2 — Content Migration | Pending |
| UX-01 | Phase 3 — UX Polish | Pending |
| UX-02 | Phase 3 — UX Polish | Pending |
| UX-03 | Phase 3 — UX Polish | Pending |
| UX-04 | Phase 3 — UX Polish | Pending |
| HOME-01 | Phase 3 — UX Polish | Pending |
| HOME-02 | Phase 3 — UX Polish | Pending |
| HOME-03 | Phase 3 — UX Polish | Pending |
| HOME-04 | Phase 3 — UX Polish | Pending |
| HOME-05 | Phase 3 — UX Polish | Pending |
| POST-01 | Phase 3 — UX Polish | Pending |
| POST-02 | Phase 3 — UX Polish | Pending |
| POST-03 | Phase 3 — UX Polish | Pending |
| AI-01 | Phase 4 — AI Drafting Pipeline | Pending |
| AI-02 | Phase 4 — AI Drafting Pipeline | Pending |
| AI-03 | Phase 4 — AI Drafting Pipeline | Pending |
| AI-04 | Phase 4 — AI Drafting Pipeline | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24 (roadmap complete)
- Unmapped: 0

---
*Requirements defined: 2026-04-26*
*Last updated: 2026-04-26 after roadmap creation — all 24 requirements mapped*
