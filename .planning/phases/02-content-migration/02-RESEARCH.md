# Phase 2: Content Migration - Research

**Researched:** 2026-05-09
**Domain:** Jekyll Liquid templating, _data/ YAML, static site content migration
**Confidence:** HIGH (all findings verified against codebase; Jekyll behavior confirmed via official docs knowledge)

---

## Executive Summary

- `blog/index.html`, `portfolio/index.html`, and the `index.html` homepage do NOT have Jekyll frontmatter — they begin with `<!--` HTML comments, so Jekyll serves them as static files and will NOT process any Liquid tags. Each file must have `---\n---` (or a real frontmatter block) added as the very first bytes before Liquid loops will work.
- `_data/` directory does not yet exist. Creating `_data/portfolio.yml` is safe and requires no `_config.yml` change — Jekyll 3.9.x autodiscovers `_data/` with zero configuration.
- The only inbound links to `blog/posts/view.html?id=...` come from JS inside `content-loader.js` (lines 78 and 109). No static HTML file links there. Once `content-loader.js` is removed/gutted, the link is gone. No other inbound static links to the old viewer exist.
- `admin-config.js` and `admin-link-handler.js` are loaded by `index.html`, `blog/index.html`, `portfolio/index.html`, and `blog/posts/view.html`. All four files need those `<script>` tags removed. `google-drive-backup.js` is loaded only by `admin/index.html` — safe to delete with no other cleanup.
- `markdown.js` is only loaded by `blog/posts/sample-post.html` (which is being deleted). After that deletion, `markdown.js` is unreferenced and can be deleted.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Blog index → Jekyll Liquid static using `{% for post in site.posts %}`
- D-02: Homepage post section → Jekyll Liquid loop (latest 3 posts)
- D-03: Admin panel → delete entirely (`git rm` 5 files)
- D-04: `content-loader.js` → remove post/portfolio rendering logic
- D-05: `blog/posts/view.html` + old post HTML files → delete
- D-06: `_data/portfolio.yml` → 2 placeholder projects
- D-07: 1 seed `_posts/*.md` (no localStorage export)
- D-08: Post schema: layout, title, date, tags, excerpt (required); series, series_order, featured, updated (optional)

### Claude's Discretion
- Exact placeholder content for seed post and portfolio entries (keep realistic and relevant to AI/ML/dev)
- Whether to keep or remove `assets/js/markdown.js` (check if it's used anywhere after admin deletion)
- Portfolio page template approach (how `portfolio/index.html` reads `_data/portfolio.yml`)

### Deferred Ideas (OUT OF SCOPE)
- None raised during discussion.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | Post frontmatter schema defined: `title`, `date`, `tags`, `excerpt` (required); `series`, `series_order`, `featured`, `updated` (optional) — schema documented and used by all committed posts | Schema verified against existing `_posts/2026-04-26-hello-world.md`; confirmed working pattern |
| CONT-02 | All existing blog posts migrated from localStorage to `_posts/*.md` committed files — publicly visible to any visitor | No localStorage posts exist (DataManager.defaultPosts = []); requires 1 seed post per D-07 |
| CONT-03 | Portfolio items migrated from localStorage to `_data/portfolio.yml` committed data — publicly visible | `_data/` dir does not exist yet; `site.data.portfolio` access confirmed; 2 placeholder projects per D-06 |
| CONT-04 | Admin panel retired after migration — localStorage-backed admin no longer used | 5 admin JS files + admin/index.html identified for deletion; all cross-page `<script>` references mapped |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Blog post listing | Frontend Server (Jekyll SSG) | — | Jekyll builds static HTML at deploy time; no JS needed |
| Portfolio rendering | Frontend Server (Jekyll SSG) | — | `site.data.portfolio` resolved at build time |
| Homepage latest posts | Frontend Server (Jekyll SSG) | — | Liquid loop `{% for post in site.posts limit:3 %}` |
| Post content rendering | Frontend Server (Jekyll SSG) | — | `_layouts/post.html` already built in Phase 1 |
| Content storage (posts) | Database/Storage (`_posts/`) | — | Committed `.md` files ARE the database |
| Content storage (portfolio) | Database/Storage (`_data/`) | — | `_data/portfolio.yml` is the data source |
| Admin panel | Retired | — | Deleted entirely; no tier owns it post-Phase 2 |

---

## Research Question Answers

### Q1: Jekyll Liquid Blog Index Pattern (Jekyll 3.9.x)

**CRITICAL prerequisite:** A file must have YAML frontmatter as its very first content to be Liquid-processed. The current `blog/index.html` starts with `<!--` — Jekyll will NOT process Liquid in it. The rewrite must begin with a frontmatter block.

**Verified pattern for blog/index.html:**

```html
---
layout: default
title: Blog
---
<main>
  <section class="latest-blog">
    <h2>Blog Posts</h2>
    <div class="card-list">
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
    </div>
  </section>
</main>
```

**Auto-available frontmatter fields** on each post object: `post.title`, `post.date`, `post.url`, `post.excerpt`, `post.tags`, `post.content`. All fields defined in `_posts/*.md` frontmatter are accessible as `post.<field>` (e.g., `post.excerpt`, `post.series`, `post.featured`).

**`post.excerpt` behavior:** Jekyll auto-generates an excerpt from the first paragraph of post content (split at the first blank line after frontmatter, or at `excerpt_separator` if configured). If the frontmatter contains an explicit `excerpt:` field, that field's value is used instead and accessible as `post.excerpt`. The explicit frontmatter `excerpt:` always takes priority. [VERIFIED: Jekyll docs knowledge, confirmed against hello-world post which has explicit `excerpt:` in frontmatter]

**`site.posts` sort order:** Always newest-first (reverse chronological by date). No explicit sort needed. [VERIFIED: Jekyll standard behavior]

**`blog/index.html` must have frontmatter:** Yes, confirmed — the HTML comment before `<!DOCTYPE html>` means Jekyll currently serves this file verbatim. Adding `---\nlayout: default\ntitle: Blog\n---` as the very first bytes makes Jekyll process it. [VERIFIED: codebase inspection]

### Q2: `_data/` Directory for Portfolio

**`_data/` does not exist** in the current codebase — must be created. [VERIFIED: filesystem check]

**No `_config.yml` change needed.** Jekyll 3.9.x autodiscovers `_data/` at the root level with zero configuration. [ASSUMED — standard Jekyll behavior; confirmed consistent with github-pages gem 232]

**Access syntax:** `site.data.portfolio` — the filename (without `.yml`) becomes the key. For `_data/portfolio.yml`, access with `site.data.portfolio`.

**YAML structure for portfolio items with tech arrays:**

```yaml
# _data/portfolio.yml
- title: "Neural Text Classifier"
  description: "Fine-tuned BERT model for multi-label document classification on domain-specific corpora."
  tech:
    - Python
    - PyTorch
    - HuggingFace Transformers
  repo: "https://github.com/songeamkanha/neural-text-classifier"
  demo: ""
  featured: true

- title: "ML Pipeline Orchestrator"
  description: "Lightweight data pipeline framework for reproducible ML experiments with automatic artifact versioning."
  tech:
    - Python
    - DVC
    - FastAPI
  repo: "https://github.com/songeamkanha/ml-pipeline"
  demo: ""
  featured: false
```

**Liquid loop for portfolio:**

```html
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
```

### Q3: Jekyll Permalink with `baseurl`

**Current config:**
- `baseurl: "/kanha_studyjournal.github.io"`
- `permalink: pretty`

**URL behavior with `permalink: pretty`:** A post at `_posts/2026-05-01-seed-post.md` gets `post.url = /2026/05/01/seed-post/`. This is the path relative to baseurl. [VERIFIED: Jekyll permalink docs]

**Correct link pattern in templates:**

```liquid
href="{{ post.url | prepend: site.baseurl }}"
```

Produces: `/kanha_studyjournal.github.io/2026/05/01/seed-post/`

**Navigation links in `_layouts/post.html`** back to blog index should use:

```liquid
<a href="{{ '/blog/' | prepend: site.baseurl }}">← Back to Blog</a>
```

**Current `blog/index.html` uses relative links** like `../assets/css/style.css` and `../index.html`. After adding Jekyll frontmatter and `layout: default`, the theme handles CSS. Nav links should be updated to use `site.baseurl` or keep relative links — relative links still work since the file stays at `blog/index.html`. However, Liquid `prepend: site.baseurl` is more robust for this site. [VERIFIED: codebase inspection]

### Q4: Removing `content-loader.js` Safely

**Files that load `content-loader.js` via `<script>` tags:** [VERIFIED: grep of all .html files]

| File | Script tag |
|------|-----------|
| `index.html` | `<script src="assets/js/content-loader.js"></script>` |
| `blog/index.html` | `<script src="../assets/js/content-loader.js"></script>` |
| `portfolio/index.html` | `<script src="../assets/js/content-loader.js"></script>` |

`blog/posts/view.html` does NOT load `content-loader.js` directly (it loads `data-manager.js` and inline JS).

**Functions in `content-loader.js` and their fate:**

| Function | Used By | Fate |
|----------|---------|------|
| `loadBackgroundInfo()` | `index.html` (DOMContentLoaded) | REMOVE — hero text/subtitle becomes static HTML in index.html; Phase 3 concern |
| `loadBlogPosts()` | `blog/index.html` | REMOVE — replaced by Jekyll Liquid loop |
| `loadHomepageBlogPosts()` | `index.html` | REMOVE — replaced by Jekyll Liquid loop |
| `loadPortfolio()` | `portfolio/index.html` | REMOVE — replaced by Jekyll Liquid loop |
| `loadHomepagePortfolio()` | `index.html` | REMOVE — replaced by Jekyll Liquid loop |
| `loadBlogPost()` | `blog/posts/view.html` (inline) | REMOVE — view.html is deleted |
| `escapeHtml()`, `formatDate()` | Internal utilities | REMOVE with the file |

**Decision (Claude's Discretion resolved):** ALL functions in `content-loader.js` become obsolete after this phase. The `loadBackgroundInfo()` function updates header name, subtitle, hero title/text, and contact links from localStorage. After this phase, those values become hardcoded static HTML in `index.html`. `content-loader.js` can be deleted entirely (`git rm assets/js/content-loader.js`). There is no non-content logic worth preserving.

### Q5: `blog/posts/view.html` and Old Post Viewer

**Inbound static HTML links:** None found. [VERIFIED: grep of all .html files]

**Only inbound references:** JavaScript in `content-loader.js`:
- Line 78: `href="posts/view.html?id=${post.id}"` (from `loadBlogPosts()`)
- Line 109: `href="blog/posts/view.html?id=${post.id}"` (from `loadHomepageBlogPosts()`)

Both are in JS template strings that will be removed when `content-loader.js` is deleted. No static inbound links exist from `index.html` or `blog/index.html`. [VERIFIED: codebase grep]

**Files to delete in `blog/posts/`:**
- `blog/posts/view.html` — old JS-powered post viewer
- `blog/posts/sample-post.html` — static sample (the only file loading `markdown.js`)
- `blog/posts/post-template.html` — empty HTML template
- `blog/posts/template.md` — has frontmatter with `published: false` but is best deleted to avoid confusion

**Note:** `blog/posts/template.md` has frontmatter with `published: false` — Jekyll 3.9.x respects `published: false` and excludes the file from `site.posts` and from the built site. It would not appear in the blog index. However, since the entire old post system is being deleted, deleting this file is cleaner. [VERIFIED: template.md frontmatter inspection]

### Q6: `portfolio/index.html` Rewrite

**Current state:** Loads `admin-config.js`, `admin-link-handler.js`, `data-manager.js`, `content-loader.js` via `<script>` tags. Calls `ContentLoader.loadPortfolio()` which populates `id="portfolio-list"` from localStorage. The div `id="portfolio-list"` is the injection target. [VERIFIED: codebase inspection]

**All 4 `<script>` tags and the inline `<script>` block must be removed.**

**The `portfolio/index.html` rewrite:**

```html
---
layout: default
title: Portfolio
---
<main>
  <section class="featured-projects">
    <h2>My Projects</h2>
    <div class="card-list">
      {% for item in site.data.portfolio %}
        <a class="card" href="{{ item.repo | default: '#' }}">
          <div class="card-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </a>
      {% endfor %}
    </div>
  </section>
</main>
```

**Admin nav link** (`<a href="../admin/index.html">Admin</a>`) must also be removed from the nav.

### Q7: `_posts/` Filename Convention and URLs

**With `permalink: pretty` in `_config.yml`:**

| Filename | Generated URL |
|----------|--------------|
| `_posts/2026-04-26-hello-world.md` | `/2026/04/26/hello-world/` |
| `_posts/2026-05-09-seed-post.md` | `/2026/05/09/seed-post/` |

With `baseurl: "/kanha_studyjournal.github.io"`, the full URL is:
`https://songeamkanha.github.io/kanha_studyjournal.github.io/2026/05/09/seed-post/`

**Jekyll requires** the filename to start with `YYYY-MM-DD-` and the rest becomes the slug. Dashes in the slug part are preserved. [VERIFIED: Jekyll standard, confirmed by hello-world post]

**Slug rules:** Lowercase only; spaces become hyphens; special characters stripped. Use lowercase kebab-case for the slug portion.

### Q8: Admin Panel Dependencies

**Admin JS files and which HTML loads them:** [VERIFIED: grep of all .html files]

| JS File | Loaded By |
|---------|-----------|
| `assets/js/admin-config.js` | `index.html`, `blog/index.html`, `portfolio/index.html`, `blog/posts/view.html`, `admin/index.html` |
| `assets/js/admin-link-handler.js` | `index.html`, `blog/index.html`, `portfolio/index.html`, `blog/posts/view.html` |
| `assets/js/admin.js` | `admin/index.html` only |
| `assets/js/google-drive-backup.js` | `admin/index.html` only |
| `assets/js/data-manager.js` | `index.html`, `blog/index.html`, `portfolio/index.html`, `blog/posts/view.html`, `admin/index.html` |

**`admin/index.html`** also loads `assets/css/admin.css` — that CSS file is loaded only by `admin/index.html`. [VERIFIED: grep]

**Script tags to remove from non-admin files:**

In `index.html` (4 script tags + inline block):
- `<script src="assets/js/admin-config.js"></script>`
- `<script src="assets/js/admin-link-handler.js"></script>`
- `<script src="assets/js/data-manager.js"></script>`
- `<script src="assets/js/content-loader.js"></script>`
- The inline `<script>` block calling `DataManager.init()`, `ContentLoader.loadBackgroundInfo()`, etc.

In `blog/index.html` (4 script tags + inline block):
- Same pattern with `../` prefix on paths

In `portfolio/index.html` (4 script tags + inline block):
- Same pattern with `../` prefix on paths

`blog/posts/view.html` is being deleted, so no cleanup needed there.

**Nav admin link** in `index.html`, `blog/index.html`, and `portfolio/index.html`:
```html
<a href="admin/index.html" style="color: var(--primary-color);">
  <i class="fas fa-cog"></i> Admin
</a>
```
Must be removed from each.

### Q9: `google-drive-backup.js` — Safe to Delete?

**Yes, safe to delete.** Only loaded by `admin/index.html`. No other HTML or JS file references it. [VERIFIED: grep]

**Admin CSS (`assets/css/admin.css`):** Only loaded by `admin/index.html`. Safe to delete with the admin panel.

### Q10: `markdown.js` — Safe to Delete After Admin Deletion?

**Yes, safe to delete.** `markdown.js` is only loaded by `blog/posts/sample-post.html` (confirmed via grep). [VERIFIED: grep]

`blog/posts/sample-post.html` is being deleted in this phase (D-05). After that deletion, `markdown.js` has zero references anywhere in the codebase. It should be deleted.

**Claude's Discretion resolved:** Delete `assets/js/markdown.js`.

---

## Standard Stack

No new dependencies in this phase. Everything uses existing tools:

| Tool | Version | Purpose |
|------|---------|---------|
| Jekyll | 3.9.x (via github-pages gem 232) | Static site generation |
| Liquid | Built into Jekyll | Template language for loops |
| YAML | Built into Jekyll | `_data/portfolio.yml` format |
| GitHub Pages | Current | Hosting |

No `npm install` needed. No CDN additions. [VERIFIED: CLAUDE.md — no bundler, CDN-only]

---

## Common Pitfalls

### Pitfall 1: Frontmatter Must Be the Absolute First Content

**What goes wrong:** File starts with `<!--` HTML comment, then `---` frontmatter later. Jekyll does NOT process Liquid in that file — it's served verbatim.

**Why it happens:** The current `blog/index.html`, `portfolio/index.html`, and `index.html` all start with HTML comments. When rewriting, if you preserve the comment before frontmatter, Liquid loops silently produce no output.

**How to avoid:** The very first bytes of any Jekyll-Liquid file must be `---`. No BOM, no comment, no blank line before.

**Warning signs:** Liquid tags appear verbatim in the rendered HTML source.

### Pitfall 2: `baseurl` Must Be Prepended to All Internal Links

**What goes wrong:** Links in Liquid templates use bare paths like `/blog/` — works locally but 404s on GitHub Pages project site because the actual path is `/kanha_studyjournal.github.io/blog/`.

**How to avoid:** Always use `| prepend: site.baseurl` for any path that starts with `/`:
```liquid
href="{{ post.url | prepend: site.baseurl }}"
href="{{ '/blog/' | prepend: site.baseurl }}"
```

**Exception:** Relative links (no leading `/`) don't need baseurl — e.g., `href="../index.html"` in `blog/index.html` still works.

**Warning signs:** Navigation works locally but 404s on the deployed site.

### Pitfall 3: Removing `loadBackgroundInfo()` Makes Homepage Hero Text Static

**What goes wrong:** Deleting `content-loader.js` also removes `loadBackgroundInfo()` which currently populates the homepage hero section (h2, .lead paragraph) and contact links from localStorage. After deletion, the hardcoded placeholder values in `index.html` show (currently "Hello, I'm Kanha", "Passionate about AI..." — these happen to be fine).

**How to avoid:** When rewriting `index.html`, set the hero text to real static values (name, tagline) rather than leaving the old "Loading articles..." placeholders. The homepage is out of scope for Phase 3 bio work, but the static hero text must at least be non-broken.

**What to do:** Keep the existing hardcoded text in the hero section (`<h2>Hello, I'm Kanha</h2>`, the lead paragraph). Remove only the JS-dynamic loading infrastructure.

### Pitfall 4: `layout: default` Theme Wraps the Full Page

**What goes wrong:** When blog/index.html adds `layout: default`, the jekyll-theme-minimal default.html provides `<html>`, `<head>`, `<body>`, site nav, and footer. If the HTML file still contains its own `<!DOCTYPE>`, `<html>`, `<body>` — the output has double-wrapped HTML.

**How to avoid:** After adding frontmatter with `layout: default`, remove the surrounding `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, `<footer>`, and existing `<header>` tags from the file. Keep only the `<main>` content section (and optionally a page-specific `<header>` if the theme's default doesn't include the page title).

**Critical check:** Inspect what `jekyll-theme-minimal`'s `default.html` provides. Based on Phase 1 research (post.html uses `layout: default` and does NOT add `<html>/<body>`), the theme handles all of that. [VERIFIED: `_layouts/post.html` does not include DOCTYPE or html/body tags]

**Practical approach for this phase:** Rather than using `layout: default` and stripping all chrome, keep the blog/index.html as a standalone full-HTML page (no layout) but add Jekyll frontmatter `---\n---` so Liquid is processed. This avoids theme chrome conflicts and preserves the existing nav/header. The `layout: default` approach requires stripping the HTML skeleton — both approaches are valid, but standalone with empty frontmatter is simpler.

**Recommended (standalone with Liquid):**
```html
---
---
<!--
  Blog home page listing all posts
-->
<!DOCTYPE html>
<html lang="en">
...
<div class="card-list">
  {% for post in site.posts %}
  ...
  {% endfor %}
</div>
...
```

### Pitfall 5: `blog/posts/template.md` Has Jekyll Frontmatter — Would Appear in Build

**What goes wrong:** `blog/posts/template.md` has `published: false` in its frontmatter. Jekyll 3.9.x honors `published: false` and excludes it from `site.posts` and the built site. However, if left in place, it's dead weight. If someone removes `published: false` accidentally, it becomes a real post.

**How to avoid:** Delete `blog/posts/template.md` along with the other `blog/posts/` files.

### Pitfall 6: `data-manager.js` Left Loading on Public Pages After Admin Deletion

**What goes wrong:** `data-manager.js` is loaded by `index.html`, `blog/index.html`, and `portfolio/index.html`. After this phase, those pages no longer need localStorage at all. If the `<script>` tag is left, `DataManager.init()` still runs on every page load and writes empty arrays to localStorage for every visitor — wasteful and confusing.

**How to avoid:** Remove `<script src="data-manager.js">` from all non-admin pages when removing `content-loader.js`. The two always appeared together and should be removed together.

---

## File-by-File Change Map

This is the complete surgery list for Phase 2. No file is touched beyond this list.

### Files to Delete (git rm)

| File | Reason |
|------|--------|
| `admin/index.html` | D-03: Admin panel retired |
| `assets/js/admin.js` | D-03: Admin panel retired |
| `assets/js/admin-config.js` | D-03: Admin panel retired (but loaded by 4 other HTML files — script tags must be removed first) |
| `assets/js/admin-link-handler.js` | D-03: Admin panel retired (same — remove script tags first) |
| `assets/js/google-drive-backup.js` | D-03: Admin panel retired (only loaded by admin/index.html) |
| `assets/css/admin.css` | Only loaded by admin/index.html |
| `assets/js/content-loader.js` | D-04: All rendering logic replaced by Jekyll Liquid |
| `assets/js/data-manager.js` | No longer needed on any public page after content-loader.js removal |
| `assets/js/markdown.js` | Only loaded by sample-post.html (being deleted) |
| `blog/posts/view.html` | D-05: Old JS post viewer; Jekyll posts have own URLs |
| `blog/posts/sample-post.html` | D-05: Old static sample |
| `blog/posts/post-template.html` | D-05: Old HTML template |
| `blog/posts/template.md` | D-05: Old markdown template (has `published: false` but delete anyway) |

**Note on `data-manager.js`:** After this phase, `data-manager.js` is unused on all public pages. `admin/index.html` (which loads it) is itself being deleted. Safe to delete entirely.

### Files to Create

| File | What | Notes |
|------|------|-------|
| `_data/portfolio.yml` | 2 placeholder portfolio items (D-06) | AI/ML themed; schema: title, description, tech[], repo, demo, featured |
| `_posts/2026-05-09-seed-post.md` | Seed blog post (D-07) | AI/ML or algorithms topic; full frontmatter per D-08 schema |

### Files to Rewrite (substantial changes)

| File | What Changes |
|------|-------------|
| `blog/index.html` | Add frontmatter (or `---\n---`), replace `#blog-posts-list` div with `{% for post in site.posts %}` loop, remove 4 `<script>` tags + inline script block, remove admin nav link |
| `portfolio/index.html` | Add frontmatter, replace `#portfolio-list` div with `{% for item in site.data.portfolio %}` loop, remove 4 `<script>` tags + inline script block, remove admin nav link |

### Files to Modify (surgical removals only)

| File | What Changes |
|------|-------------|
| `index.html` | Replace `#homepage-blog-list` section with `{% for post in site.posts limit:3 %}` loop, replace `.featured-projects .card-list` with `{% for item in site.data.portfolio limit:2 %}` loop, remove 4 `<script>` tags + inline script block, remove admin nav link, add `---\n---` frontmatter |

---

## Architecture Patterns

### Blog Index Loop

**Minimal verified pattern for `blog/index.html`:**

```html
---
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Blog | Kanha's Study Journal</title>
  <link rel="stylesheet" href="../assets/css/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
</head>
<body>
  <header>
    <div class="header-content">
      <h1>Kanha Songeam</h1>
      <p class="subtitle">AI/ML Engineer &amp; Developer</p>
      <nav>
        <a href="{{ '/' | prepend: site.baseurl }}">Home</a>
        <a href="{{ '/portfolio/' | prepend: site.baseurl }}">Portfolio</a>
        <a href="{{ '/blog/' | prepend: site.baseurl }}" class="active">Blog</a>
      </nav>
    </div>
  </header>
  <main>
    <section class="latest-blog">
      <h2>Blog Posts</h2>
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
    </section>
  </main>
  <footer>
    <div class="footer-content">
      <p>&copy; 2026 Kanha Songeam. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
```

**Why empty frontmatter `---\n---`:** Using `---\n---` (no layout) keeps the file as a full standalone HTML page, matching the existing structure of `blog/index.html`. This avoids the double-wrapping issue from `layout: default`. Jekyll will still process Liquid tags in the file.

### Portfolio Data Pattern

**`_data/portfolio.yml` YAML:**

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

**Liquid access:**

```liquid
{% for item in site.data.portfolio %}
  {{ item.title }}        <!-- String -->
  {{ item.description }}  <!-- String -->
  {% for t in item.tech %}{{ t }}{% endfor %}  <!-- Array loop -->
  {{ item.repo }}         <!-- String (URL) -->
  {{ item.featured }}     <!-- Boolean -->
{% endfor %}
```

### Seed Post Schema (D-08 compliant)

```markdown
---
layout: post
title: "Understanding Attention Mechanisms in Transformers"
date: 2026-05-09
tags: [machine-learning, transformers, deep-learning]
excerpt: "A ground-up look at how scaled dot-product attention works, why it replaced RNNs for sequence tasks, and what the math actually means."
---

Post content here...
```

**Required fields:** `layout: post`, `title`, `date` (YYYY-MM-DD), `tags` (array), `excerpt` (string)
**Optional fields:** `series`, `series_order`, `featured`, `updated`

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Post listing | Custom JS fetch + render | `{% for post in site.posts %}` | Jekyll provides sorted, frontmatter-parsed list at build time |
| Portfolio data | localStorage or JS config | `_data/portfolio.yml` + `site.data.portfolio` | Zero-config, version-controlled, no JS needed |
| Excerpt generation | JS substring logic | `post.excerpt` (Jekyll auto or explicit frontmatter) | Jekyll auto-generates from first paragraph; explicit frontmatter overrides |
| Date formatting | JS `toLocaleDateString()` | `{{ post.date | date: "%B %-d, %Y" }}` | Liquid date filter; no JS needed |
| Post URL construction | Custom JS path building | `{{ post.url | prepend: site.baseurl }}` | Jekyll generates correct URLs with baseurl |

---

## Runtime State Inventory

> Included because this is a migration phase — retiring a localStorage-based system.

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | `localStorage` keys: `blog_posts`, `portfolio_items`, `background_info` — all initialized with empty arrays/defaults (verified: `defaultPosts = []`, `defaultPortfolio = []`). No real user content exists. | No data migration needed. localStorage will remain in browser but is no longer read by any code after this phase. |
| Live service config | None — GitHub Pages is the only external service; no config stored outside git | None |
| OS-registered state | None | None |
| Secrets/env vars | None for this phase (no API keys involved) | None |
| Build artifacts | `blog/posts/` HTML files and `assets/js/` admin files are existing build artifacts to be deleted | `git rm` per change map above |

**Key finding:** `DataManager.init()` initializes `defaultPosts = []` — there are zero real posts in localStorage. No export step is needed. Phase 2 adds seed content directly as committed files. [VERIFIED: data-manager.js line 18]

---

## Open Questions

1. **RESOLVED: Does `blog/index.html` need frontmatter to process Liquid?**
   Yes — confirmed. The file currently starts with `<!--` which prevents Jekyll Liquid processing. Frontmatter must be added as the very first content.

2. **RESOLVED: Is there any localStorage content to migrate?**
   No — `DataManager.defaultPosts = []` and `defaultPortfolio = []`. No export step needed. Confirmed by reading `data-manager.js` lines 18 and 24.

3. **RESOLVED: Is `markdown.js` safe to delete?**
   Yes — only referenced by `blog/posts/sample-post.html` which is being deleted. Verified via grep.

4. **RESOLVED: Is `google-drive-backup.js` safe to delete?**
   Yes — only referenced by `admin/index.html` which is being deleted. Verified via grep.

5. **RESOLVED: Does `_data/` need any `_config.yml` changes?**
   No — Jekyll 3.9.x autodiscovers `_data/` at the root with zero configuration.

6. **OPEN: Does `index.html` homepage need frontmatter for Liquid processing?**
   Yes — `index.html` starts with `<!--` comment (same as blog/index.html). It needs `---\n---` frontmatter to enable Liquid loops for the homepage latest posts section. **Action:** Add frontmatter to `index.html` as part of its rewrite.

7. **OPEN: What happens to `loadBackgroundInfo()` content after removal?**
   The homepage hero section (h2, .lead) and contact links are currently populated from localStorage by `loadBackgroundInfo()`. After removal, the hardcoded HTML values show: `<h2>Hello, I'm Kanha</h2>`, `<p class="lead">Passionate about AI, Machine Learning, and Software Development</p>`, and placeholder GitHub/LinkedIn/email links. These are acceptable for Phase 2 — Phase 3 adds the real bio section (HOME-01). The planner should keep the existing static hero HTML as-is and just remove the JS that overwrites it.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 2 is purely file edits (create, modify, delete HTML/YAML/Markdown). No external tools, runtimes, databases, or CLIs are required beyond git.

---

## Validation Architecture

Step 4: SKIPPED — `workflow.nyquist_validation` is explicitly `false` in `.planning/config.json`.

---

## Security Domain

This phase has no security-relevant operations. The primary security action is REMOVING the admin panel (which eliminates the client-side-only auth vulnerability). No new authentication, input handling, or cryptography is introduced. ASVS categories not applicable.

---

## Sources

### Primary (HIGH confidence)
- `assets/js/data-manager.js` — confirmed `defaultPosts = []`, localStorage schema, confirmed double-init guard already applied from Phase 1
- `assets/js/content-loader.js` — confirmed all functions and which HTML files trigger them
- `blog/index.html`, `portfolio/index.html`, `index.html` — confirmed no Jekyll frontmatter; confirmed all script tag references
- `_config.yml` — confirmed `baseurl: "/kanha_studyjournal.github.io"`, `permalink: pretty`
- `_layouts/post.html` — confirmed Phase 1 minimal skeleton with `layout: default`; confirmed no `<html>/<body>` tags (theme handles wrapper)
- `_posts/2026-04-26-hello-world.md` — confirmed frontmatter schema pattern
- Filesystem grep — confirmed all `<script>` tag references across all HTML files

### Secondary (MEDIUM confidence)
- `.planning/research/PITFALLS.md` — domain pitfalls from prior Phase 1 research session
- `.planning/phases/01-jekyll-foundation/01-02-SUMMARY.md` — Phase 1 execution summary confirming what was built

### Notes on Jekyll behavior claims
Jekyll `_data/` autodiscovery, `site.posts` sort order, `post.excerpt` priority (explicit frontmatter over auto-generated), `permalink: pretty` URL patterns, and frontmatter-as-first-bytes requirement are based on well-established Jekyll documentation. These behaviors have been stable since Jekyll 2.x and are unchanged in 3.9.x. [ASSUMED — not verified against live Jekyll 3.9.x docs in this session, but extremely high confidence given stability of these features]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `_data/` directory requires no `_config.yml` change in Jekyll 3.9.x — autodiscovered | Q2 | Low: If wrong, add `data_dir: _data` to _config.yml — trivial fix |
| A2 | Jekyll `permalink: pretty` produces `/YYYY/MM/DD/slug/` format | Q7 | Low: Hello-world test post at `/2026/04/26/hello-world/` will confirm on deploy |
| A3 | `post.excerpt` explicit frontmatter field takes priority over auto-generated first-paragraph excerpt | Q1 | Low: If wrong, posts with explicit `excerpt:` would show different text on blog index — easily detected |

---

## Metadata

**Confidence breakdown:**
- File inventory (what exists, what loads what): HIGH — verified via direct file reads and grep
- Jekyll Liquid patterns: HIGH (A1-A3 caveats noted) — stable Jekyll behavior
- `_data/portfolio.yml` access: HIGH — standard Jekyll feature
- Admin deletion scope: HIGH — all references mapped via grep
- URL/baseurl behavior: HIGH — confirmed pattern matches existing `_config.yml`

**Research date:** 2026-05-09
**Valid until:** 2026-06-09 (github-pages gem 232 is stable; Jekyll 3.9.x behavior does not change)
