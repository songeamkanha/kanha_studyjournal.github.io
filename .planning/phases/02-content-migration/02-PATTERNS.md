# Phase 2: Content Migration — Pattern Map

**Mapped:** 2026-05-09
**Files analyzed:** 5 new/rewritten + 3 surgical edits + 13 deletions
**Analogs found:** 4 / 5 (one file type — YAML data — has no prior analog in codebase)

---

## File Classification

| New / Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------------|------|-----------|----------------|---------------|
| `blog/index.html` | page (Jekyll Liquid) | request-response (SSG) | `_layouts/post.html` | role-match (both Liquid-processed Jekyll files) |
| `portfolio/index.html` | page (Jekyll Liquid) | request-response (SSG) | `blog/index.html` (current, being replaced) | structural match |
| `index.html` | page (Jekyll Liquid, partial) | request-response (SSG) | `blog/index.html` (current structure) + `_layouts/post.html` (Liquid) | structural + Liquid match |
| `_data/portfolio.yml` | data file (YAML) | batch (read at build time) | none | no analog |
| `_posts/2026-05-09-seed-post.md` | content (Markdown post) | batch (SSG) | `_posts/2026-04-26-hello-world.md` | exact |

---

## Pattern Assignments

### `blog/index.html` (page, request-response SSG)

**Analog:** `_layouts/post.html` for Liquid syntax; `blog/index.html` (current) for HTML skeleton structure

**Critical prerequisite** — frontmatter as the absolute first bytes:
The current file starts with `<!--` on line 1. Jekyll will NOT process Liquid in a file that does not begin with `---`. The rewrite must open with the frontmatter block and nothing before it.

**Frontmatter block (no layout — standalone full-HTML file):**
```html
---
---
```
Using empty frontmatter (no `layout:` key) keeps the file as a standalone full-HTML page, preserving the existing `<html>/<head>/<body>` skeleton. This avoids double-wrapping by `jekyll-theme-minimal`'s `default.html`. `_layouts/post.html` uses `layout: default` and therefore contains NO `<!DOCTYPE>` / `<html>` / `<body>` — the opposite of what `blog/index.html` needs.

**HTML skeleton to keep** (from `blog/index.html` lines 5-14, 15-30, 43-49):
- `<!DOCTYPE html>`, `<html lang="en">`, `<head>` with `<meta charset>`, `<meta viewport>`, `<title>`, `<link rel="stylesheet" href="../assets/css/style.css">`, Font Awesome CDN link
- `<header>` with `.header-content` > `<h1>`, `.subtitle`, `<nav>`
- `<footer>` with `.footer-content`

**Nav links pattern** — convert relative paths to Liquid baseurl:
```html
<!-- BEFORE (lines 21-24 of current blog/index.html) -->
<a href="../index.html">Home</a>
<a href="../portfolio/index.html">Portfolio</a>
<a href="index.html" class="active">Blog</a>
<a href="../index.html#contact">Contact</a>

<!-- AFTER — use Liquid prepend filter -->
<a href="{{ '/' | prepend: site.baseurl }}">Home</a>
<a href="{{ '/portfolio/' | prepend: site.baseurl }}">Portfolio</a>
<a href="{{ '/blog/' | prepend: site.baseurl }}" class="active">Blog</a>
<a href="{{ '/' | prepend: site.baseurl }}#contact">Contact</a>
```
Remove the Admin nav link entirely (line 25-27 of current file).

**Core Liquid loop pattern** — replaces `<div id="blog-posts-list">` (current lines 35-40):
```html
<div class="card-list">
  {% if site.posts.size == 0 %}
    <div class="empty-state">
      <h3>No posts yet</h3>
      <p>Check back soon!</p>
    </div>
  {% else %}
    {% for post in site.posts %}
      <a class="card" href="{{ post.url | prepend: site.baseurl }}">
        <div class="card-content">
          <span class="date">{{ post.date | date: "%B %-d, %Y" }}</span>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
          <span class="read-more">Read More &rarr;</span>
        </div>
      </a>
    {% endfor %}
  {% endif %}
</div>
```

**Date filter pattern** (sourced from `_layouts/post.html` line 8):
```liquid
{{ post.date | date: "%B %-d, %Y" }}
```

**Script tags to remove** (current `blog/index.html` lines 51-63 — the entire block):
```html
<script src="../assets/js/admin-config.js"></script>
<script src="../assets/js/admin-link-handler.js"></script>
<script src="../assets/js/data-manager.js"></script>
<script src="../assets/js/content-loader.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof DataManager !== 'undefined') { DataManager.init(); }
    ContentLoader.loadBlogPosts();
  });
</script>
```
All five elements deleted. No replacement — Jekyll Liquid handles rendering at build time.

---

### `portfolio/index.html` (page, request-response SSG)

**Analog:** `blog/index.html` (current — same structure, same script block pattern, same admin nav link)

**Frontmatter block** — same as blog/index.html: empty `---\n---` as first two bytes.

**HTML skeleton to keep** (from `portfolio/index.html` lines 5-14, 15-30, 43-49):
Same structure as blog/index.html: full `<html>/<head>/<body>` skeleton, `<header>` with nav, `<footer>`.

**Nav links pattern** — same relative-to-Liquid conversion:
```html
<!-- BEFORE (portfolio/index.html lines 21-24) -->
<a href="../index.html">Home</a>
<a href="index.html" class="active">Portfolio</a>
<a href="../blog/index.html">Blog</a>
<a href="../index.html#contact">Contact</a>

<!-- AFTER -->
<a href="{{ '/' | prepend: site.baseurl }}">Home</a>
<a href="{{ '/portfolio/' | prepend: site.baseurl }}" class="active">Portfolio</a>
<a href="{{ '/blog/' | prepend: site.baseurl }}">Blog</a>
<a href="{{ '/' | prepend: site.baseurl }}#contact">Contact</a>
```
Remove Admin nav link (lines 25-27 of current file).

**Core Liquid loop pattern** — replaces `<div id="portfolio-list">` (current lines 35-40):
```html
<div class="card-list">
  {% if site.data.portfolio.size == 0 %}
    <div class="empty-state">
      <h3>No projects yet</h3>
      <p>Check back soon!</p>
    </div>
  {% else %}
    {% for item in site.data.portfolio %}
      <a class="card" href="{{ item.repo | default: '#' }}">
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          {% if item.tech %}
            <ul class="tech-list">
              {% for t in item.tech %}<li>{{ t }}</li>{% endfor %}
            </ul>
          {% endif %}
        </div>
      </a>
    {% endfor %}
  {% endif %}
</div>
```

**Data access:** `site.data.portfolio` — Jekyll autodiscovers `_data/portfolio.yml` at build time; the filename stem (`portfolio`) is the access key. No `_config.yml` change required.

**Script tags to remove** (current `portfolio/index.html` lines 51-63 — entire block):
```html
<script src="../assets/js/admin-config.js"></script>
<script src="../assets/js/admin-link-handler.js"></script>
<script src="../assets/js/data-manager.js"></script>
<script src="../assets/js/content-loader.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof DataManager !== 'undefined') { DataManager.init(); }
    ContentLoader.loadPortfolio();
  });
</script>
```

---

### `index.html` (page, partial rewrite — surgical edits only)

**Analog:** `blog/index.html` (current — same skeleton, same script block pattern); `_layouts/post.html` for Liquid date/URL filters

**Frontmatter block** — add as the very first bytes, displacing the current `<!--` comment on line 1:
```html
---
---
```
The `<!--` HTML comment on line 1 currently prevents Jekyll from processing Liquid. The comment may be kept AFTER the frontmatter block (line 3 onward), but the `---\n---` must be the absolute first content.

**Keep untouched** (lines 33-42 — hero section):
```html
<section class="hero">
  <div class="hero-content">
    <h2>Hello, I'm Kanha</h2>
    <p class="lead">Passionate about AI, Machine Learning, and Software Development</p>
    <div class="cta-buttons">
      <a href="portfolio/index.html" class="btn primary">View My Work</a>
      <a href="blog/index.html" class="btn secondary">Read My Blog</a>
    </div>
  </div>
</section>
```
`loadBackgroundInfo()` was overwriting this from localStorage. After script removal, the hardcoded values are correct as-is. Do not replace with Liquid — bio content is a Phase 3 concern.

**Replace featured-projects section** (current lines 44-62 — static placeholder cards):
```html
<!-- BEFORE: two static placeholder cards -->
<section class="featured-projects">
  <h2>Featured Projects</h2>
  <div class="card-list">
    <a class="card" href="portfolio/index.html">...AI/ML Projects placeholder...</a>
    <a class="card" href="portfolio/index.html">...Software Development placeholder...</a>
  </div>
</section>

<!-- AFTER: Jekyll Liquid loop, limit 2 -->
<section class="featured-projects">
  <h2>Featured Projects</h2>
  <div class="card-list">
    {% for item in site.data.portfolio limit:2 %}
      <a class="card" href="{{ item.repo | default: '#' }}">
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </a>
    {% endfor %}
  </div>
</section>
```

**Replace latest-blog section** (current lines 64-72 — `#homepage-blog-list` loading placeholder):
```html
<!-- BEFORE: JS-populated div -->
<section class="latest-blog">
  <h2>Latest Articles</h2>
  <div class="card-list" id="homepage-blog-list">
    <div style="...">Loading articles...</div>
  </div>
</section>

<!-- AFTER: Jekyll Liquid loop, limit 3 -->
<section class="latest-blog">
  <h2>Latest Articles</h2>
  <div class="card-list">
    {% for post in site.posts limit:3 %}
      <a class="card" href="{{ post.url | prepend: site.baseurl }}">
        <div class="card-content">
          <span class="date">{{ post.date | date: "%B %-d, %Y" }}</span>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
          <span class="read-more">Read More &rarr;</span>
        </div>
      </a>
    {% endfor %}
  </div>
</section>
```

**Admin nav link to remove** (current `index.html` lines 25-27):
```html
<a href="admin/index.html" style="color: var(--primary-color);">
  <i class="fas fa-cog"></i> Admin
</a>
```

**Script block to remove** (current `index.html` lines 97-113):
```html
<script src="assets/js/admin-config.js"></script>
<script src="assets/js/admin-link-handler.js"></script>
<script src="assets/js/data-manager.js"></script>
<script src="assets/js/content-loader.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof DataManager !== 'undefined') { DataManager.init(); }
    ContentLoader.loadBackgroundInfo();
    ContentLoader.loadHomepagePortfolio();
    ContentLoader.loadHomepageBlogPosts();
  });
</script>
```

---

### `_data/portfolio.yml` (data file, batch/SSG)

**Analog:** None — no `_data/` directory exists in the codebase. This is the first Jekyll data file.

**Pattern source:** Jekyll documentation standard + 02-RESEARCH.md Q2 examples

**YAML schema** (2 items, fields: title, description, tech[], repo, demo, featured):
```yaml
- title: "Neural Text Classifier"
  description: "Fine-tuned BERT model for multi-label document classification on domain-specific corpora. Achieves 91% F1 on the benchmark dataset."
  tech:
    - Python
    - PyTorch
    - HuggingFace Transformers
  repo: "https://github.com/songeamkanha/neural-text-classifier"
  demo: ""
  featured: true

- title: "ML Experiment Tracker"
  description: "Lightweight CLI tool for tracking hyperparameters, metrics, and artifacts across ML training runs without requiring a server."
  tech:
    - Python
    - SQLite
    - Click
  repo: "https://github.com/songeamkanha/ml-tracker"
  demo: ""
  featured: false
```

**Access in Liquid:** `site.data.portfolio` — the filename stem is the key. Arrays iterate with `{% for item in site.data.portfolio %}`. Array fields iterate with `{% for t in item.tech %}`.

**No `_config.yml` change needed.** Jekyll 3.9.x autodiscovers `_data/` at the project root.

---

### `_posts/2026-05-09-seed-post.md` (Markdown post, batch/SSG)

**Analog:** `_posts/2026-04-26-hello-world.md` — exact role and data flow match

**Frontmatter pattern** (copy from `hello-world.md` lines 1-7, extend with D-08 required fields):
```markdown
---
layout: post
title: "Understanding Attention Mechanisms in Transformers"
date: 2026-05-09
tags: [machine-learning, transformers, deep-learning]
excerpt: "A ground-up look at how scaled dot-product attention works, why it replaced RNNs for sequence tasks, and what the math actually means."
---
```

**D-08 required fields:** `layout: post`, `title`, `date` (YYYY-MM-DD), `tags` (array), `excerpt` (string)
**D-08 optional fields available:** `series`, `series_order`, `featured`, `updated`

**Filename convention** (from `hello-world.md` naming): `YYYY-MM-DD-slug.md` where slug is lowercase kebab-case. The date in the filename drives `post.date` and `post.url`.

**URL generated** with `permalink: pretty` (`_config.yml` line 16): `/2026/05/09/seed-post/`
**Full URL on GitHub Pages:** `https://songeamkanha.github.io/kanha_studyjournal.github.io/2026/05/09/seed-post/`

**Post body:** Substantive markdown content (not just a one-liner like hello-world). Aim for 300-500 words with at least one code block and one subheading. The post is public and should be worth reading.

---

## Shared Patterns

### Frontmatter-as-First-Bytes (applies to `blog/index.html`, `portfolio/index.html`, `index.html`)

**Source:** `_layouts/post.html` lines 1-3 (the only existing Jekyll-processed file)

```html
---
layout: default
---
```

**Rule:** The `---` opening delimiter must be the absolute first bytes of the file. No BOM, no blank line, no HTML comment before it. The current `blog/index.html`, `portfolio/index.html`, and `index.html` all start with `<!--` on line 1 — this causes Jekyll to serve them verbatim with no Liquid processing. The HTML comment may follow after the closing `---` on line 3 or later.

**Apply to:** All three pages being rewritten. Use `---\n---` (empty frontmatter, no layout key) to keep the standalone full-HTML structure and avoid double-wrapping by the theme.

### Baseurl Prepend (applies to all Liquid link expressions)

**Source:** 02-RESEARCH.md Q3; `_config.yml` line 5 (`baseurl: "/kanha_studyjournal.github.io"`)

```liquid
<!-- Post URLs -->
href="{{ post.url | prepend: site.baseurl }}"

<!-- Static paths -->
href="{{ '/blog/' | prepend: site.baseurl }}"
href="{{ '/portfolio/' | prepend: site.baseurl }}"
href="{{ '/' | prepend: site.baseurl }}"
```

**Exception:** Relative links (no leading `/`) used in `<link rel="stylesheet" href="../assets/css/style.css">` do NOT need the filter and should be left as-is.

**Apply to:** Every `href` in Liquid expressions in `blog/index.html`, `portfolio/index.html`, and `index.html`.

### Liquid Date Filter (applies to all post loops)

**Source:** `_layouts/post.html` line 8

```liquid
{{ post.date | date: "%B %-d, %Y" }}
```

Produces output like `May 9, 2026`. The `%-d` format (no zero-padding) is Linux/macOS compatible and supported by GitHub Pages' Liquid runtime.

**Apply to:** All `{% for post in site.posts %}` loops in `blog/index.html` and `index.html`.

### Liquid Excerpt Filter (applies to all post loops)

**Source:** 02-RESEARCH.md Q1; no existing codebase usage yet

```liquid
{{ post.excerpt | strip_html | truncatewords: 30 }}
```

`strip_html` removes any markup from auto-generated excerpts. `truncatewords: 30` caps length. If the post frontmatter has an explicit `excerpt:` field, that value takes priority over the auto-generated first paragraph.

**Apply to:** All `{% for post in site.posts %}` loops.

### Script Block Deletion Pattern (applies to `blog/index.html`, `portfolio/index.html`, `index.html`)

All three files share the same four-script + inline-script block at the bottom of `<body>`. The entire block is deleted with no replacement:

```html
<!-- This entire block is removed from all three files -->
<script src="[../]assets/js/admin-config.js"></script>
<script src="[../]assets/js/admin-link-handler.js"></script>
<script src="[../]assets/js/data-manager.js"></script>
<script src="[../]assets/js/content-loader.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof DataManager !== 'undefined') { DataManager.init(); }
    ContentLoader.load*();  <!-- varies by page -->
  });
</script>
```

(`../` prefix applies to `blog/` and `portfolio/` subdirectory files; `index.html` uses bare `assets/...` paths.)

### Admin Nav Link Deletion Pattern (applies to `blog/index.html`, `portfolio/index.html`, `index.html`)

All three files contain the same admin nav link. Remove it with no replacement:
```html
<a href="[../]admin/index.html" style="color: var(--primary-color);">
  <i class="fas fa-cog"></i> Admin
</a>
```

---

## Files Being Deleted (scope confirmation, no analog needed)

| File | Classification | Deletion Trigger |
|------|---------------|-----------------|
| `admin/index.html` | admin panel page | D-03: admin retired |
| `assets/js/admin.js` | admin UI logic | D-03: admin retired; only loaded by admin/index.html |
| `assets/js/admin-config.js` | admin configuration JS | D-03: remove script tags from 4 HTML files first, then git rm |
| `assets/js/admin-link-handler.js` | admin nav injection | D-03: same — remove script tags from 3 public HTML files first, then git rm |
| `assets/js/google-drive-backup.js` | backup utility | D-03: only loaded by admin/index.html; safe to git rm directly |
| `assets/css/admin.css` | admin stylesheet | D-03: only loaded by admin/index.html |
| `assets/js/content-loader.js` | localStorage render engine (244 lines) | D-04: all 5 functions replaced by Jekyll Liquid; entire file obsolete |
| `assets/js/data-manager.js` | localStorage CRUD | D-04 consequence: no public page uses localStorage after phase; admin/index.html (its only other user) is deleted |
| `assets/js/markdown.js` | Markdown renderer | Only loaded by sample-post.html (being deleted); unreferenced after |
| `blog/posts/view.html` | JS-powered post viewer | D-05: Jekyll posts have own URLs; only inbound links were in content-loader.js (also deleted) |
| `blog/posts/sample-post.html` | static sample post | D-05: old post system; the only file loading markdown.js |
| `blog/posts/post-template.html` | empty HTML template | D-05: old post system |
| `blog/posts/template.md` | markdown post template (published: false) | D-05: old post system; excluded from build by published: false but delete for cleanliness |

**Deletion order matters for `admin-config.js` and `admin-link-handler.js`:** Remove their `<script>` tags from `blog/index.html`, `portfolio/index.html`, and `index.html` in the same commit (or prior commit) before running `git rm` on the JS files. Otherwise the deployed site would reference deleted files.

---

## Jekyll 3.9.x Quirks to Carry Into Planning

1. **Frontmatter-first:** Any file not starting with `---` is served verbatim; Liquid is silently skipped. No error is raised.
2. **`_data/` autodiscovery:** No `_config.yml` entry needed; the directory is scanned automatically.
3. **`site.posts` order:** Always reverse-chronological (newest first). No sort filter needed.
4. **`permalink: pretty`** (active in `_config.yml`): Post URLs end with a trailing slash: `/2026/05/09/seed-post/` — link targets should include the slash.
5. **`post.excerpt` priority:** Explicit `excerpt:` in frontmatter overrides the auto-generated first-paragraph excerpt. Use explicit excerpts for predictable output.
6. **`layout: default` double-wrapping:** `jekyll-theme-minimal`'s `default.html` provides the full `<html>/<head>/<body>` shell. Any file using `layout: default` must NOT also contain `<!DOCTYPE html>` etc. Since `blog/index.html` and `portfolio/index.html` keep their HTML skeletons, they use empty frontmatter (`---\n---`) with no layout key.

---

## Metadata

**Analog search scope:** `_layouts/`, `_posts/`, `blog/`, `portfolio/`, `index.html`, `assets/js/`
**Files read:** 8 (post.html, hello-world.md, _config.yml, blog/index.html, portfolio/index.html, index.html, content-loader.js, 02-RESEARCH.md)
**Pattern extraction date:** 2026-05-09
