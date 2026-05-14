# Phase 2: Content Migration - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate all content from the localStorage-backed system into committed files visible to every visitor. This phase delivers: post frontmatter schema, seed posts in `_posts/`, portfolio data in `_data/portfolio.yml`, blog/homepage rewritten as Jekyll Liquid templates, and the admin panel deleted. The site must work correctly with zero JS for content rendering.

**Out of scope:** Typography, tags UI, reading time, homepage bio/featured sections, syntax highlighting — those are Phase 3.

</domain>

<decisions>
## Implementation Decisions

### D-01 — Blog rendering approach
**Jekyll Liquid static rendering.** Rewrite `blog/index.html` as a Jekyll-processed file using `{% for post in site.posts %}` loops. Posts are rendered at build time — no JavaScript required. `content-loader.js` is removed (the post-rendering portion). This matches the Phase 1 `_layouts/post.html` approach and makes posts SEO-indexable.

### D-02 — Homepage rendering approach
Homepage post section (currently JS-rendered via `content-loader.js`) is replaced with a Jekyll Liquid loop showing the latest 3 posts. The switch is static-only — no JS fetch.

### D-03 — Admin panel retirement
**Delete entirely.** `git rm` all admin files:
- `admin/index.html`
- `assets/js/admin.js`
- `assets/js/admin-config.js`
- `assets/js/admin-link-handler.js`
- `assets/js/google-drive-backup.js`

The new authoring workflow is: write `.md` in editor → commit → push. No admin UI.

### D-04 — content-loader.js handling
Remove the post-rendering and portfolio-rendering logic from `content-loader.js` (those responsibilities move to Jekyll Liquid). If any non-content logic remains (e.g., background info rendering), keep only that — otherwise delete the file entirely.

### D-05 — blog/posts/view.html retirement
`blog/posts/view.html` is the old JS-powered post viewer. Delete it — Jekyll posts now have their own static URLs (`/2026/04/26/hello-world/`). Same for `blog/posts/sample-post.html` and `blog/posts/post-template.html`.

### D-06 — Portfolio seed
`_data/portfolio.yml` is seeded with **2 placeholder projects** (realistic-looking but generic) so the portfolio page renders something meaningful. Kanha replaces them with real projects after Phase 2. Schema: `title`, `description`, `tech` (array), `repo` (optional), `demo` (optional), `featured` (boolean, default false).

### D-07 — Seed posts
`DataManager` initializes with `defaultPosts = []` — there is no localStorage content to export. Phase 2 adds **1 seed post** (beyond the hello-world test post from Phase 1) as a real-content placeholder with proper frontmatter. Kanha replaces it with real posts after Phase 2. No migration export step needed.

### D-08 — Post frontmatter schema (CONT-01)
Already decided in Phase 1 context. Required: `layout: post`, `title`, `date`, `tags`, `excerpt`. Optional: `series`, `series_order`, `featured`, `updated`.

### Claude's Discretion
- Exact placeholder content for seed post and portfolio entries (keep realistic and relevant to AI/ML/dev)
- Whether to keep or remove `assets/js/markdown.js` (check if it's used anywhere after admin deletion)
- Portfolio page template approach (how `portfolio/index.html` reads `_data/portfolio.yml`)

</decisions>

<specifics>
## Specific Ideas

- Portfolio page uses Jekyll `{% for item in site.data.portfolio %}` to render project cards — same pattern as `{% for post in site.posts %}` for blog
- Seed post should be on an AI/ML or algorithms topic (matches Kanha's focus)
- Placeholder portfolio projects should feel like real dev projects (AI/ML tooling, data pipeline, etc.)

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 decisions (already built)
- `.planning/phases/01-jekyll-foundation/01-CONTEXT.md` — locked decisions on config, post layout, DataManager guard
- `.planning/phases/01-jekyll-foundation/01-01-SUMMARY.md` — what _config.yml contains
- `.planning/phases/01-jekyll-foundation/01-02-SUMMARY.md` — what _layouts/post.html contains
- `.planning/phases/01-jekyll-foundation/01-03-SUMMARY.md` — DataManager guard implementation

### Project context
- `.planning/REQUIREMENTS.md` — CONT-01 to CONT-04 full text
- `.planning/ROADMAP.md` — Phase 2 success criteria

### Codebase files to read before planning
- `assets/js/data-manager.js` — understand localStorage schema (keys: blog_posts, portfolio_items, background_info)
- `assets/js/content-loader.js` — understand what rendering logic to remove
- `blog/index.html` — current blog index to rewrite
- `portfolio/index.html` — current portfolio page to rewrite
- `index.html` — homepage post/portfolio sections to rewrite

</canonical_refs>

<deferred>
## Deferred Ideas

None raised during discussion.

</deferred>

---

*Phase: 02-content-migration*
*Context gathered: 2026-05-09*
