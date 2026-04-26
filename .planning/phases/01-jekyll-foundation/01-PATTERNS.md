# Phase 1: Jekyll Foundation - Pattern Map

**Mapped:** 2026-04-26
**Files analyzed:** 7 (4 create, 3 modify/delete)
**Analogs found:** 5 / 7 (2 files have no codebase analog — new artifact types)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `Gemfile` | config | build-time | none in repo | no analog |
| `_config.yml` | config | build-time | `_config.yml` (self) | exact — modify in place |
| `_layouts/post.html` | template | request-response (static HTML) | `index.html` (HTML5 structure) | partial — same HTML5 doc shape |
| `_posts/2026-04-26-hello-world.md` | content | build-time | none in repo | no analog |
| `index.md` | — | DELETE | `index.md` (self) | exact — reading to confirm safe deletion |
| `assets/js/data-manager.js` | utility | event-driven | `assets/js/data-manager.js` (self) | exact — patch `init()` |
| `.gitignore` | config | — | `.gitignore` (self) | exact — append entry |

---

## Pattern Assignments

### `Gemfile` (config, build-time)

**Analog:** None in codebase. Pattern sourced from RESEARCH.md (verified against docs.github.com and rubygems.org).

**Exact content to create:**
```ruby
# Source: docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll
source "https://rubygems.org"

gem "github-pages", "~> 232", group: :jekyll_plugins
```

**Key constraint (CLAUDE.md + D-11):** Use `gem "github-pages"` — never `gem "jekyll"` directly. The `~> 232` pessimistic version constraint allows patch upgrades within gem 232.x. Do NOT use Jekyll 4.x.

**No lock file in repo:** `Gemfile.lock` must NOT be committed. It is already in `_config.yml`'s exclude list (line 22) but is missing from `.gitignore`. The `.gitignore` task adds it.

---

### `_config.yml` (config, build-time)

**Analog:** `_config.yml` itself — modify in place.

**Current state** (full file read, lines 1-55):
- Line 2: `title: My GitHub Pages Site` — placeholder, must be replaced
- Line 3: `description: A personal website...` — generic placeholder, must be replaced
- Line 4: `url: "https://kanha_studyjournal.github.io"` — wrong username, must be replaced
- Line 8: `theme: jekyll-theme-minimal` — keep as-is (D-06)
- Lines 12-13: `markdown: kramdown` and `highlighter: rouge` — keep as-is
- Line 16: `permalink: pretty` — keep as-is
- Lines 19-23: `exclude:` block — keep as-is (already excludes `Gemfile` and `Gemfile.lock`)
- Lines 25-27: `plugins:` — keep `jekyll-feed` and `jekyll-seo-tag`; ADD `jekyll-sitemap` (D-05)
- Lines 30-33: `social_links:` block — DELETE entirely (D-04)
- Lines 36-38: `author:` block — keep `name:`, DELETE `email:` line (D-04)
- Lines 41-42: `paginate: 5` and `paginate_path:` — DELETE both lines (no `jekyll-paginate` gem; causes build warning per RESEARCH.md Pitfall 1)
- Lines 45-54: `navigation:` block — keep as-is (used by `jekyll-theme-minimal`'s default layout)

**Target state for changed sections:**

```yaml
# Lines 2-4 replacement
title: "Kanha's Study Journal"
description: "Notes on what I'm learning — algorithms, systems, ML, and building things."
url: "https://songeamkanha.github.io"
```

```yaml
# Lines 25-27 replacement (add jekyll-sitemap)
plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap
```

```yaml
# Lines 36-38 replacement (strip email per D-04)
author:
  name: Kanha Songeam
```

**Lines to delete entirely:**
- Lines 30-33: entire `social_links:` block
- Lines 41-42: `paginate: 5` and `paginate_path: "/page:num/"`

**Anti-pattern to avoid:** Do NOT add `{% seo %}` to the new `_layouts/post.html` — `jekyll-theme-minimal`'s `default.html` already includes it. Duplicating causes duplicate meta tags (RESEARCH.md Pitfall, Anti-Patterns section).

---

### `_layouts/post.html` (template, request-response)

**Analog:** `index.html` (lines 1-15) provides the HTML5 document pattern for this project, but `_layouts/post.html` uses Liquid inheritance (`layout: default`) rather than a self-contained HTML document — so the outer `<html>/<head>` come from `jekyll-theme-minimal`'s `default.html`, not from this file.

**HTML5 structure pattern from `index.html`** (lines 5-14):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>...</title>
</head>
<body>
```
Note: This pattern applies to standalone HTML files. `_layouts/post.html` does NOT reproduce this — it inherits the shell from `layout: default`.

**Exact content to create** (per D-09, D-10, RESEARCH.md Code Examples):
```html
---
layout: default
---
<article class="post">
  <header>
    <h1>{{ page.title }}</h1>
    <time datetime="{{ page.date | date_to_xmlschema }}">
      {{ page.date | date: "%B %-d, %Y" }}
    </time>
  </header>
  <div class="post-content">
    {{ content }}
  </div>
</article>
```

**What this inherits from `jekyll-theme-minimal`'s `default.html`:**
- `<html>`, `<head>`, `<meta charset>`, `<meta viewport>`
- Theme stylesheet link
- `{% seo %}` tag (do NOT add it here — already in default)

**Phase 3 replacement note:** This layout is intentionally bare (D-09). Phase 3 replaces it with Lora/Inter fonts, nav, and site chrome. The planner should note this file is a Phase 1 placeholder only.

---

### `_posts/2026-04-26-hello-world.md` (content, build-time)

**Analog:** None in codebase — first `_posts/` entry.

**Post frontmatter schema** (from CLAUDE.md `## Post Frontmatter Schema`):
```yaml
---
title: "Post Title"
date: 2026-04-26
tags: [algorithms, cs-fundamentals]
excerpt: "One-sentence summary."
series: "Algorithms Deep Dive"   # optional
series_order: 2                  # optional
featured: false                  # optional
updated: 2026-05-01              # optional
---
```

**Minimum required fields for INFRA-01 routing test** (RESEARCH.md Pattern 2):
```yaml
---
layout: post
title: "Hello, World"
date: 2026-04-26
tags: [test]
excerpt: "Test post verifying the Jekyll post pipeline works end-to-end."
---
```

**File naming rule:** `YYYY-MM-DD-title-slug.md` in `_posts/` — triggers Jekyll routing to `/YYYY/MM/DD/title-slug/` with `permalink: pretty`.

**File naming for test post:** `_posts/2026-04-26-hello-world.md` → URL: `/2026/04/26/hello-world/`

**Body content (Claude's discretion — D in CONTEXT.md):**
```markdown
This is a test post confirming that the Jekyll build pipeline processes
`_posts/*.md` files and renders them at their expected URLs.

Visit `/2026/04/26/hello-world/` to verify routing works end-to-end.
```

**No `.gitkeep` needed:** Committing the test post directly satisfies INFRA-01 and creates the directory in one step.

---

### `index.md` (DELETE)

**Analog:** `index.md` itself — confirmed safe to delete.

**Current state** (lines 1-84): The active frontmatter block at lines 38-41 uses `layout: home` which is not a valid layout in this site. The entire Markdown body beginning at line 43 is duplicated by `index.html` which is the authoritative homepage. The block at lines 1-34 is fully commented out.

**Deletion is safe because:**
- `index.html` (the authoritative homepage) covers all content
- The conflict (`index.md` + `index.html` both map to `_site/index.html`) causes unpredictable Jekyll build output (RESEARCH.md Pitfall 2, INFRA-03)
- No content will be lost — the Markdown body duplicates `index.html` and the first block is commented out

**Action:** `git rm index.md` — removes from both filesystem and git tracking in one step.

---

### `assets/js/data-manager.js` (utility, event-driven)

**Analog:** `assets/js/data-manager.js` itself — patch `init()` only.

**Current `init()` body** (lines 12-40):
```js
init() {
  // Initialize blog posts
  if (!this.getBlogPosts().length) {
    const defaultPosts = [];
    localStorage.setItem(this.STORAGE_KEYS.BLOG_POSTS, JSON.stringify(defaultPosts));
  }

  // Initialize portfolio
  if (!this.getPortfolio().length) {
    const defaultPortfolio = [];
    localStorage.setItem(this.STORAGE_KEYS.PORTFOLIO, JSON.stringify(defaultPortfolio));
  }

  // Initialize background info
  if (!this.getBackgroundInfo()) {
    const defaultBackground = { ... };
    localStorage.setItem(this.STORAGE_KEYS.BACKGROUND, JSON.stringify(defaultBackground));
  }
},
```

**Current auto-call** (lines 158-161 — DO NOT REMOVE per D-08):
```js
// Initialize on load
if (typeof window !== 'undefined') {
  DataManager.init();
}
```

**Target patch — insert at lines 13-14, before existing init body:**
```js
init() {
  if (this._initialized) return;   // guard: prevent double-init
  this._initialized = true;        // mark as initialized
  // Initialize blog posts
  if (!this.getBlogPosts().length) {
    // ... rest of existing body unchanged ...
  }
  // ...
},
```

**Why this pattern is correct:** The object literal `DataManager` does not use a class constructor, so `_initialized` initialises to `undefined` (falsy) on first call, satisfies `if (this._initialized) return` only on second+ calls. No prototype changes, no HTML file changes needed.

**Call sites confirmed in RESEARCH.md (lines 233):**
- `index.html:106` — DOMContentLoaded handler
- `blog/index.html:59` — DOMContentLoaded handler
- `portfolio/index.html:59` — DOMContentLoaded handler
- `blog/posts/view.html:53` — DOMContentLoaded handler
- `data-manager.js:160` — auto-call on script load (keep, guard makes it safe)

All five call sites become safe after the guard is added. No changes needed in any HTML file.

---

### `.gitignore` (config, append)

**Analog:** `.gitignore` itself — append one entry.

**Current Jekyll section** (lines 32-37):
```
# Jekyll (GitHub Pages)
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata
```

**Entry to add:**
```
Gemfile.lock
```

**Placement:** Append to the existing `# Jekyll (GitHub Pages)` section (after line 36, `.jekyll-metadata`). The `_config.yml` `exclude:` list at lines 19-23 already lists `Gemfile.lock` for Jekyll's build exclusion, but `.gitignore` controls git tracking — both are needed and serve different purposes.

---

## Shared Patterns

### Jekyll Liquid Output Variables
**Apply to:** `_layouts/post.html`, `_posts/*.md`

```liquid
{{ page.title }}                              — post title from frontmatter
{{ page.date | date_to_xmlschema }}           — ISO 8601 for <time datetime="...">
{{ page.date | date: "%B %-d, %Y" }}          — human-readable: "April 26, 2026"
{{ content }}                                 — rendered Markdown body
```

### JavaScript Guard Pattern (idempotent init)
**Apply to:** `assets/js/data-manager.js`

```js
// Pattern: top of any init() that must be idempotent
if (this._initialized) return;
this._initialized = true;
```

This pattern is conventional for singleton-style JS objects (not classes). No constructor needed.

### YAML Config Values (D-01 through D-06)
**Apply to:** `_config.yml`

```yaml
url: "https://songeamkanha.github.io"   # D-01: always include https:// protocol
title: "Kanha's Study Journal"           # D-02
author:
  name: Kanha Songeam                    # D-03
# NO email, NO social_links              # D-04
plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap                       # D-05: added
theme: jekyll-theme-minimal              # D-06: unchanged
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `Gemfile` | config | build-time | No Ruby Gemfile exists in the repo; this project had no local Jekyll setup before Phase 1 |
| `_posts/2026-04-26-hello-world.md` | content | build-time | No `_posts/` directory exists; this is the first committed post |

---

## Metadata

**Analog search scope:** `/Users/kanhasongeam/Coding-Tech/kanha_studyjournal.github.io/` — all files at root and `assets/js/`
**Files read:** `_config.yml`, `assets/js/data-manager.js`, `.gitignore`, `index.md`, `index.html` (lines 1-30)
**Pattern extraction date:** 2026-04-26
**Research cross-references:** RESEARCH.md Patterns 1-3, Code Examples section, Pitfalls 1-6, Anti-Patterns section
