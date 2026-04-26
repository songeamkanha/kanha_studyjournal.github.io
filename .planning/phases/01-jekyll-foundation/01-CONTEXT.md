# Phase 1: Jekyll Foundation - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Stand up the Jekyll build pipeline so committed `_posts/*.md` files render as deployed HTML pages on GitHub Pages. This phase is pure plumbing: create missing Jekyll scaffolding, fix the config, remove the index.md conflict, and patch the DataManager double-init bug so Phase 2 (content migration) can begin safely. No design, no content migration, no UX work in this phase.

</domain>

<decisions>
## Implementation Decisions

### `_config.yml` values
- **D-01:** `url:` set to `https://songeamkanha.github.io`
- **D-02:** `title:` set to `Kanha's Study Journal`
- **D-03:** `author.name:` set to `Kanha Songeam`
- **D-04:** Strip the `social_links` section and `author.email` entirely — remove those optional fields rather than filling or stubbing them. Add back later when needed.
- **D-05:** Add `jekyll-sitemap` to the plugins list (joins the existing `jekyll-feed` and `jekyll-seo-tag` already there). INFRA-02 requires all three.
- **D-06:** Keep `theme: jekyll-theme-minimal` — no theme change in this phase.

### `index.md` removal
- **D-07:** Delete `index.md` entirely — it conflicts with `index.html` during Jekyll build (INFRA-03). The file has only a commented-out frontmatter block; no content is lost.

### DataManager double-init fix
- **D-08:** Add an `_initialized` guard flag at the top of `init()` in `assets/js/data-manager.js`:
  ```js
  if (this._initialized) return;
  this._initialized = true;
  ```
  One-line change, no HTML files touched, init becomes safely idempotent. Do NOT remove the auto-call at line 160 — the guard approach was explicitly chosen over that.

### `_layouts/post.html` scope
- **D-09:** Minimal skeleton only — `<title>`, `{{ page.date }}`, `{{ content }}`, valid HTML5 structure. No CDN links, no nav, no site chrome. Phase 3 replaces this layout entirely.
- **D-10:** No site navigation in the Phase 1 post layout. Just the post content.

### Gemfile
- **D-11:** Create `Gemfile` using `gem "github-pages"` (locked to GitHub Pages gem, Jekyll 3.9.x). Do NOT use Jekyll 4.x. This is a hard constraint from the project (see CLAUDE.md).

### Claude's Discretion
- Test post content for INFRA-01 validation — Claude picks a minimal placeholder post (e.g., a short "Hello World" style entry) to verify routing works
- Exact description text for `_config.yml` (the site description field) — should be brief and accurate to the site brand
- Whether to add `_posts/.gitkeep` or just commit the test post directly

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project constraints
- `CLAUDE.md` — Jekyll 3.9.x constraint (use `gem "github-pages"`, never Jekyll 4), no framework, no build step, CDN-only for front-end deps

### Requirements
- `.planning/REQUIREMENTS.md` §Infrastructure — INFRA-01 through INFRA-04 define all acceptance criteria for this phase
- `.planning/ROADMAP.md` §Phase 1 — success criteria (test post renders, no placeholders, index.md removed, double-init patched)

### Existing files to modify
- `_config.yml` — current state; needs url, title, author.name filled and social_links stripped
- `assets/js/data-manager.js` — double-init bug at line 160; guard flag goes into `init()` at line 12

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `assets/js/data-manager.js`: The existing `DataManager` object — only `init()` needs patching. All other methods are unaffected by this phase.

### Established Patterns
- No existing `_layouts/` directory — will be created from scratch in this phase
- No existing `_posts/` directory — will be created with a single test post
- No `Gemfile` — will be created; `Gemfile.lock` will be generated on first `bundle install`
- `_config.yml` exists and is the authoritative site config — modify in place, don't replace

### Integration Points
- `index.html` and `blog/index.html` load `data-manager.js` via `<script>` — the guard flag addition is invisible to these callers; no changes needed in HTML files
- `content-loader.js` auto-calls `DataManager.init()` conditionally at line 239 — the guard flag makes this safe without touching content-loader.js

</code_context>

<specifics>
## Specific Ideas

- No specific references or "I want it like X" moments from discussion — this is a plumbing phase with clear deliverables.

</specifics>

<deferred>
## Deferred Ideas

- Lora/Inter font CDN links in post layout — Phase 3 (UX Polish) adds typography. Not in Phase 1 scope.
- Site navigation in post layout — Phase 3 adds site chrome. Phase 1 layout is intentionally bare.
- Social profile links (Twitter, GitHub, LinkedIn) in `_config.yml` — fill in when the site is ready to promote; not blocking for Phase 1 or 2.

</deferred>

---

*Phase: 01-jekyll-foundation*
*Context gathered: 2026-04-26*
