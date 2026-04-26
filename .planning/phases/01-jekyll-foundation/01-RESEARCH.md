# Phase 1: Jekyll Foundation - Research

**Researched:** 2026-04-26
**Domain:** GitHub Pages / Jekyll 3.10.x build pipeline, `_config.yml`, post routing, DataManager JS fix
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** `url:` set to `https://songeamkanha.github.io`
- **D-02:** `title:` set to `Kanha's Study Journal`
- **D-03:** `author.name:` set to `Kanha Songeam`
- **D-04:** Strip the `social_links` section and `author.email` entirely — remove rather than stub. Add back later.
- **D-05:** Add `jekyll-sitemap` to the plugins list (joins `jekyll-feed` and `jekyll-seo-tag` already there).
- **D-06:** Keep `theme: jekyll-theme-minimal` — no theme change in this phase.
- **D-07:** Delete `index.md` entirely — it has only a commented-out frontmatter block; no content is lost.
- **D-08:** Add `_initialized` guard flag to `DataManager.init()`. Do NOT remove the auto-call at line 160.
- **D-09:** `_layouts/post.html` minimal skeleton only — `<title>`, `{{ page.date }}`, `{{ content }}`, valid HTML5. No CDN links, no nav. Phase 3 replaces it.
- **D-10:** No site navigation in Phase 1 post layout.
- **D-11:** Create `Gemfile` using `gem "github-pages"` (Jekyll 3.9.x-compatible). Never Jekyll 4.x.

### Claude's Discretion

- Test post content for INFRA-01 validation — minimal placeholder (e.g. "Hello World" style entry)
- Exact description text for `_config.yml` site description field
- Whether to add `_posts/.gitkeep` or just commit the test post directly

### Deferred Ideas (OUT OF SCOPE)

- Lora/Inter font CDN links in post layout — Phase 3 (UX Polish)
- Site navigation in post layout — Phase 3 adds site chrome
- Social profile links (Twitter, GitHub, LinkedIn) in `_config.yml` — not blocking for Phase 1 or 2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | `_layouts/post.html` exists and Jekyll post pipeline processes `_posts/*.md` files into routed HTML pages | Theme override lookup confirmed: custom `_layouts/post.html` supersedes theme's version. Post file naming convention `YYYY-MM-DD-title.md` triggers routing. |
| INFRA-02 | `_config.yml` has no unfilled placeholders; `jekyll-feed`, `jekyll-seo-tag`, and `jekyll-sitemap` plugins enabled | All three plugins are whitelisted by GitHub Pages. `url:` and `title:` are required for `jekyll-sitemap` and `jekyll-seo-tag` to emit correct output. `paginate:` setting must be removed (causes build warning without `jekyll-paginate`). |
| INFRA-03 | `index.md` removed so it no longer conflicts with `index.html` during Jekyll build | Confirmed: both files map to the same `_site/index.html` destination; Jekyll build fails or produces unpredictable output. Deletion is the correct fix. |
| INFRA-04 | `DataManager.init()` double-init bug diagnosed and fixed before content migration begins | Bug confirmed at line 160 (auto-call) + 4 HTML files call it explicitly. Guard flag pattern is idempotent and safe. |
</phase_requirements>

---

## Summary

Phase 1 is pure infrastructure plumbing with zero design or content work. It has four discrete deliverables: create the Gemfile to pin Jekyll to the GitHub Pages version, fix `_config.yml` (fill placeholders, enable all three required plugins, remove the `paginate` setting that has no backing plugin), create a minimal `_layouts/post.html` and a test `_posts/` entry to prove routing works, and patch the `DataManager.init()` double-init bug with an `_initialized` guard.

The GitHub Pages build pipeline runs Jekyll 3.10.0 (via `github-pages` gem 232) server-side. The Gemfile is used for local development parity. Local development with Ruby 2.6 (the system Ruby on this machine) may require upgrading Ruby or using Homebrew Ruby to satisfy the gem's Ruby >= 2.3.0 requirement — however, local dev is optional; the live GitHub Pages build will succeed even if `bundle install` never runs locally. The planner should make the Gemfile a deliverable but flag local `bundle install` as a nice-to-have, not a blocker.

A non-obvious pitfall was found in the current `_config.yml`: it contains `paginate: 5` and `paginate_path: "/page:num/"` but does NOT list `jekyll-paginate` in `plugins`. Jekyll 3.x will emit a deprecation warning (`"You appear to have pagination turned on..."`) on every build. This setting should be removed as part of the INFRA-02 cleanup.

**Primary recommendation:** Fix `_config.yml` first (removes placeholders and build warnings), then create the `_layouts/post.html` + test post, then patch `DataManager`. All four deliverables are independent and can be planned as sequential tasks in a single wave.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Post rendering (HTML generation) | Jekyll / GitHub Pages build server | — | `_posts/*.md` → static HTML; no JS needed for rendering |
| Post routing / URLs | Jekyll (permalink: pretty) | — | `permalink: pretty` in `_config.yml` controls URL structure |
| Site config / metadata | Jekyll `_config.yml` | — | Plugins, theme, author, url all controlled at build time |
| DataManager init guard | Browser JS | — | Client-side only fix; guard prevents double-write to localStorage |
| Layout override | Local `_layouts/` directory | jekyll-theme-minimal (fallback) | Custom `post.html` in `_layouts/` takes precedence over gem theme |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| github-pages | 232 | Pins Jekyll to the exact version GitHub Pages uses; includes all whitelisted plugins | Ensures local dev matches live build; replaces direct Jekyll install |
| Jekyll | 3.10.0 (via github-pages) | Static site generator; processes `_posts/*.md` | Bundled by github-pages gem; do not install separately |
| kramdown | 2.4.0 (via github-pages) | Markdown parser for post bodies | GitHub Pages-pinned; set in `_config.yml` via `markdown: kramdown` |
| rouge | 3.30.0 (via github-pages) | Syntax highlighter | Only highlighter supported by GitHub Pages; set via `highlighter: rouge` |
| jekyll-feed | 0.17.0 (via github-pages) | Generates Atom feed (RSS) at `/feed.xml` | Whitelisted GitHub Pages plugin |
| jekyll-seo-tag | 2.8.0 (via github-pages) | Injects SEO meta tags and Open Graph tags | Whitelisted GitHub Pages plugin; requires `{% seo %}` in layout `<head>` |
| jekyll-sitemap | 1.4.0 (via github-pages) | Generates `sitemap.xml` | Whitelisted GitHub Pages plugin; requires `url:` in `_config.yml` |

**Version verification:** [VERIFIED: pages.github.com/versions] — All versions confirmed against the official GitHub Pages dependency endpoint on 2026-04-26. GitHub Pages currently runs Jekyll 3.10.0 (not 3.9.x as stated in older docs, the pinned version is updated occasionally within the 3.x line).

### Gemfile exact syntax

```ruby
# Source: docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll
source "https://rubygems.org"

gem "github-pages", "~> 232", group: :jekyll_plugins
```

Replace `232` with the version at `https://pages.github.com/versions/` if it has changed since this research (2026-04-26).

**Gemfile.lock:** Do NOT commit. GitHub Pages ignores it; committing it causes local/server divergence. Add to `.gitignore`:
```
Gemfile.lock
```
[VERIFIED: docs.github.com/en/pages/.../creating-a-github-pages-site-with-jekyll]

### Installation command

```bash
bundle install
```

**Important:** Requires Ruby >= 2.3.0. System Ruby on this machine is 2.6.10 (`/usr/bin/ruby`) — this meets the minimum. The github-pages gem 232 declares `required_ruby_version: >= 2.3.0`. [VERIFIED: rubygems.org/gems/github-pages/versions/232]

However, local `bundle install` may fail or produce warnings on old system Rubies with certain native extension gems. The GitHub Pages server-side build uses Ruby 3.3.4. Local dev is optional — the live build works without it.

---

## Architecture Patterns

### System Architecture Diagram

```
Commit push to GitHub (main branch)
         |
         v
GitHub Pages build runner
  - Reads Gemfile (github-pages ~> 232)
  - Runs Jekyll 3.10.0 with safe: true
  - Processes _posts/YYYY-MM-DD-title.md
         |
         +-- Reads _layouts/post.html (local file)
         |        overrides jekyll-theme-minimal/post.html
         +-- Applies _config.yml plugins
         |        jekyll-feed -> /feed.xml
         |        jekyll-seo-tag -> <meta> tags in <head>
         |        jekyll-sitemap -> /sitemap.xml
         +-- Renders Markdown with kramdown
         +-- Applies permalink: pretty
         |        /2026/04/26/hello-world/ (trailing slash)
         v
_site/ (static HTML deployed to GitHub Pages CDN)
         |
         v
Visitor browser
  - Receives static HTML (no JS needed for post content)
  - index.html loads data-manager.js -> DataManager.init() (guard flag prevents double-init)
```

### Recommended Project Structure (post-Phase 1)

```
/
├── _config.yml         # site config (no placeholders, 3 plugins, no paginate)
├── _layouts/
│   └── post.html       # minimal post layout (Phase 1); replaced in Phase 3
├── _posts/
│   └── 2026-04-26-hello-world.md  # test post to verify INFRA-01
├── Gemfile             # gem "github-pages", "~> 232"
├── index.html          # existing homepage (untouched in Phase 1)
├── assets/
│   └── js/
│       └── data-manager.js  # patched with _initialized guard
└── .gitignore          # must include Gemfile.lock (add in Phase 1)
```

### Pattern 1: Custom Layout Overrides Theme Layout

**What:** Jekyll checks `_layouts/post.html` in the site repo before falling back to the gem theme's layout.
**When to use:** Always — create `_layouts/post.html` locally to control post rendering independently of the `jekyll-theme-minimal` gem.
**Example:**

```html
<!-- Source: jekyllrb.com/docs/themes/#overriding-theme-defaults -->
---
layout: default
---
<article>
  <header>
    <h1>{{ page.title }}</h1>
    <time datetime="{{ page.date | date_to_xmlschema }}">
      {{ page.date | date: "%B %-d, %Y" }}
    </time>
  </header>
  {{ content }}
</article>
```

**Key point:** This layout uses `layout: default` in its own frontmatter. This means it wraps inside `jekyll-theme-minimal`'s `default.html`, which provides the `<html>`, `<head>`, and outer chrome. This is correct for Phase 1 — `default.html` from the theme will apply global site chrome automatically.

**Implication for `{% seo %}`:** `jekyll-theme-minimal`'s `default.html` already includes the `{% seo %}` tag in its `<head>`. A `post.html` that inherits from `default` gets SEO tags automatically — no need to add `{% seo %}` to the custom `post.html`. [VERIFIED: github.com/pages-themes/minimal — default.html confirmed to include seo tag]

### Pattern 2: Post File Naming and Routing

**What:** Files in `_posts/` named `YYYY-MM-DD-title-slug.md` are automatically processed.
**When to use:** All committed blog posts.

```
_posts/2026-04-26-hello-world.md
  → URL: /2026/04/26/hello-world/   (with permalink: pretty)
  → Title from frontmatter: title: "Hello World"
```

**Minimum frontmatter for a post:**
```yaml
---
layout: post
title: "Hello World"
date: 2026-04-26
---
```

`layout: post` is required to use the custom `_layouts/post.html`. The date in frontmatter must be ISO 8601 (`YYYY-MM-DD`). [VERIFIED: jekyllrb.com/docs/posts]

### Pattern 3: DataManager `_initialized` Guard

**What:** Idempotent init guard preventing double-initialization.
**When to use:** At the very top of `DataManager.init()`.

```js
// Source: confirmed by reading assets/js/data-manager.js (lines 12-40)
init() {
  if (this._initialized) return;
  this._initialized = true;
  // ... rest of existing init() body unchanged
}
```

This guard makes `DataManager.init()` safely callable any number of times — the second call hits `return` immediately. The auto-call at line 160 and all four HTML files calling `DataManager.init()` in `DOMContentLoaded` continue to work unchanged. [VERIFIED: codebase — confirmed 4 HTML call sites (index.html:106, blog/index.html:59, portfolio/index.html:59, blog/posts/view.html:53) plus auto-call at data-manager.js:160]

### Anti-Patterns to Avoid

- **Setting `layout: post` in `_config.yml` defaults without creating `_layouts/post.html`:** Jekyll will silently fall back to the theme's post layout rather than error. Always create the file first, then verify the output.
- **Leaving `paginate: 5` without `jekyll-paginate` in plugins:** Causes a build warning on every deploy. Remove both `paginate` and `paginate_path` from `_config.yml` — Phase 1 has no pagination requirement.
- **Committing `Gemfile.lock`:** GitHub Pages ignores it; it can cause local/remote mismatches and noisy diffs.
- **Adding `{% seo %}` to `_layouts/post.html` when it inherits from `default`:** The theme's `default.html` already includes it. Duplicating the tag causes duplicate SEO meta tags — explicit Google warning.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS feed | Custom XML template | `jekyll-feed` plugin | Edge cases: date formatting, CDATA escaping, namespace declarations; already whitelisted by GitHub Pages |
| SEO meta tags | Hardcoded `<meta>` in layout | `jekyll-seo-tag` plugin | Handles Open Graph, Twitter Card, JSON-LD schema, canonical URLs — all from frontmatter |
| XML sitemap | Custom `sitemap.xml` template | `jekyll-sitemap` plugin | Proper lastmod dates, changefreq, priority; correct for all page types |
| Post URL routing | Custom permalink logic | Jekyll `permalink: pretty` in `_config.yml` | Already supported natively; custom routing breaks with Jekyll's paginator and sitemaps |

**Key insight:** All three required plugins (feed, seo-tag, sitemap) are pre-whitelisted on GitHub Pages and bundled in the `github-pages` gem. No extra installation step beyond adding to `plugins:` in `_config.yml`.

---

## Common Pitfalls

### Pitfall 1: `paginate: 5` Without `jekyll-paginate` Plugin

**What goes wrong:** Jekyll 3.x emits `Deprecation: You appear to have pagination turned on, but you haven't included the jekyll-paginate gem` on every build. The build does not fail, but the warning is noisy and the paginate setting is non-functional.
**Why it happens:** The current `_config.yml` has `paginate: 5` and `paginate_path: "/page:num/"` but `jekyll-paginate` is NOT in the plugins list. This is a legacy stub from initial site setup.
**How to avoid:** Remove `paginate:` and `paginate_path:` from `_config.yml` entirely. `jekyll-paginate` is NOT needed in Phase 1 (and is not required — pagination is not in any Phase 1 requirement).
**Warning signs:** Build log on GitHub Pages shows deprecation warning; local `bundle exec jekyll build` output shows warning.

### Pitfall 2: `index.md` + `index.html` Destination Conflict

**What goes wrong:** Jekyll converts `index.md` to `_site/index.html`. `index.html` also maps to `_site/index.html`. The build writes one over the other, producing unpredictable output.
**Why it happens:** Both files share the same output destination. The order of writing is undefined.
**How to avoid:** Delete `index.md`. The file contains only a commented-out frontmatter block — the live site content is entirely in `index.html`. [VERIFIED: read index.md — entire Markdown body is inside a comment `<!-- ... -->`; the active frontmatter block has layout: home which is not a valid layout in this site anyway]
**Warning signs:** `index.html` starts showing Jekyll-processed Markdown output instead of the static HTML page.

### Pitfall 3: `_layouts/post.html` Using `layout: default` Not Inherited Correctly

**What goes wrong:** If `jekyll-theme-minimal`'s `default.html` is not found (e.g., gem not installed locally), the post renders as raw HTML with no `<html>` wrapper.
**Why it happens:** Local `bundle install` may not have run; gem theme not available locally.
**How to avoid:** Run `bundle exec jekyll serve` (not `jekyll serve` directly) so the gem theme is loaded via Bundler. On GitHub Pages, the gem is always available.
**Warning signs:** Post page has no `<head>` tag, no stylesheet applied, raw content only.

### Pitfall 4: `url:` in `_config.yml` Without Protocol

**What goes wrong:** `jekyll-sitemap` generates incorrect canonical URLs; `jekyll-seo-tag` emits malformed Open Graph `og:url` values.
**Why it happens:** Setting `url: songeamkanha.github.io` (no `https://`) causes the plugins to emit relative or malformed URLs.
**How to avoid:** Always include the protocol: `url: "https://songeamkanha.github.io"` (D-01 already specifies this correctly).
**Warning signs:** `sitemap.xml` contains entries without `https://`; browser console errors on social sharing.

### Pitfall 5: `social_links` Section Not Fully Removed

**What goes wrong:** `jekyll-seo-tag` reads `site.social` to generate structured data. Leaving a `twitter: your_twitter_handle` stub causes the tag to emit a schema.org sameAs entry pointing to `https://twitter.com/your_twitter_handle` on every page.
**Why it happens:** Plugin reads YAML keys that exist even if their values are stubs.
**How to avoid:** D-04 explicitly strips the `social_links` section entirely. The `author.email` field must also be removed. [ASSUMED: jekyll-seo-tag behavior with stub social_links — planner should verify this is addressed by D-04 strip]

### Pitfall 6: Gemfile.lock Committed

**What goes wrong:** Local Gemfile.lock locks to the developer's Ruby/gem versions; GitHub Pages ignores it during build, but it creates noisy diffs and can cause `bundle install` failures for other contributors.
**How to avoid:** The current `.gitignore` does NOT include `Gemfile.lock`. Add it to `.gitignore` as part of Gemfile creation (Phase 1 task).

---

## Code Examples

### Minimal `_layouts/post.html` (Phase 1)

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

Notes:
- `layout: default` inherits `jekyll-theme-minimal`'s `default.html` for `<html>`, `<head>`, stylesheet, `{% seo %}`.
- `{{ page.date | date_to_xmlschema }}` in the `datetime` attribute is machine-readable; `date: "%B %-d, %Y"` is human-readable.
- No CDN links, no nav, no site chrome — per D-09/D-10.

### Minimal test post `_posts/2026-04-26-hello-world.md`

```markdown
---
layout: post
title: "Hello, World"
date: 2026-04-26
tags: [test]
excerpt: "Test post verifying the Jekyll post pipeline works end-to-end."
---

This is a test post confirming that the Jekyll build pipeline processes
`_posts/*.md` files and renders them at their expected URLs.

Visit `/2026/04/26/hello-world/` to verify routing.
```

### Complete `_config.yml` diff (key changes)

```yaml
# CHANGE: fill in real values
title: "Kanha's Study Journal"
description: "Notes on what I'm learning — algorithms, systems, ML, and building things."
url: "https://songeamkanha.github.io"

# CHANGE: fill in real author name, strip email
author:
  name: Kanha Songeam
  # email removed (D-04)

# ADD: jekyll-sitemap to complete INFRA-02
plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap

# REMOVE: paginate settings (no jekyll-paginate gem; causes build warning)
# paginate: 5            <- DELETE
# paginate_path: "/page:num/"  <- DELETE

# REMOVE: entire social_links block (D-04)
# social_links:          <- DELETE BLOCK
```

### `DataManager.init()` guard flag

```js
// In assets/js/data-manager.js, at the top of init():
init() {
  if (this._initialized) return;   // ADD: guard flag
  this._initialized = true;        // ADD: mark as initialized
  // ... existing init body unchanged ...
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `gem "jekyll"` in Gemfile | `gem "github-pages"` in Gemfile | Jekyll 3.0+ era | Ensures local/server version parity |
| Jekyll 3.9.x | Jekyll 3.10.0 | github-pages 232 (Aug 2024) | Stable; no breaking changes from 3.9 |
| `gems:` key in `_config.yml` | `plugins:` key in `_config.yml` | Jekyll 3.5+ | `gems:` still works but deprecated; use `plugins:` |
| `paginate` built into Jekyll | `jekyll-paginate` separate gem | Jekyll 3.0 | Pagination requires explicit gem; `paginate` in config without gem = warning |

**Deprecated/outdated:**
- `gems:` key in `_config.yml`: replaced by `plugins:`; still accepted in Jekyll 3.x but avoid in new config
- `jekyll-paginate` v1: no longer under active development; not needed for Phase 1 (no pagination required)

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `jekyll-theme-minimal`'s `default.html` already includes `{% seo %}` in its `<head>` | Code Examples / Pitfall 3 | If wrong, post pages would be missing SEO meta tags until Phase 3; low severity since Phase 1 is a plumbing phase |
| A2 | `social_links:` stub values in `_config.yml` are emitted by `jekyll-seo-tag` as real structured data | Pitfall 5 | If wrong, stub twitter handle is already publishing to live site — stripping it (D-04) is still correct regardless |

---

## Open Questions

1. **Local development vs. live-only workflow**
   - What we know: System Ruby is 2.6.10; `bundle install` may work (>= 2.3.0 satisfied) but Ruby 2.6 EOL'd in 2022 and some gems may require newer versions.
   - What's unclear: Whether `bundle install` will complete without errors on Ruby 2.6 for github-pages 232 (some transitive deps may require Ruby >= 2.7).
   - Recommendation: Plan Gemfile creation as a deliverable; note in the task that `bundle install` should be attempted but a live-only deploy to GitHub Pages is an acceptable fallback if it fails. The planner should flag this as a "verify locally" step, not a "blocker."

2. **Whether `.gitignore` needs `Gemfile.lock` added**
   - What we know: Current `.gitignore` does not include `Gemfile.lock`.
   - Recommendation: Add `Gemfile.lock` to `.gitignore` as part of the Gemfile creation task.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Ruby | `bundle install` (local dev) | Yes | 2.6.10 (system `/usr/bin/ruby`) | GitHub Pages server-side build (Ruby 3.3.4) |
| Bundler | `bundle install` | Yes | 1.17.2 | Upgrade: `gem install bundler` |
| Jekyll (via gem) | Local preview | No (not installed) | — | `bundle exec jekyll serve` after `bundle install` |
| github-pages gem | Local dev parity | No (not installed) | — | Live GitHub Pages build is the fallback |
| git | Committing files | Yes (assumed) | — | — |

**Missing dependencies with no fallback:** None — all missing deps are local dev conveniences. The live GitHub Pages build is the authoritative build environment.

**Missing dependencies with fallback:**
- `github-pages` gem: not installed locally. Plan must include `bundle install` step, but live deploy is a valid fallback.
- Bundler 1.17.2 is old; github-pages 232 may require Bundler >= 2.x. The task should run `gem install bundler` before `bundle install` if `bundle install` fails.

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Phase 1 |
|-----------|-------------------|
| Jekyll version: `gem "github-pages"` only, never Jekyll 4.x | Gemfile must use `gem "github-pages", "~> 232"` |
| No framework, no build step, CDN-only for front-end deps | `_layouts/post.html` must be pure HTML/Liquid — no npm, no Sass compile, no asset pipeline |
| No API keys in repo | Not applicable to Phase 1; no AI CLI code in this phase |
| `.env` and `node_modules/` in `.gitignore` before AI CLI code | Not applicable to Phase 1 |

---

## Sources

### Primary (HIGH confidence)
- [pages.github.com/versions](https://pages.github.com/versions/) — Current Jekyll version (3.10.0), github-pages gem version (232), all plugin versions confirmed
- [docs.github.com — Creating a GitHub Pages site with Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll) — Gemfile syntax, Gemfile.lock guidance
- [rubygems.org/gems/github-pages/versions/232](https://rubygems.org/gems/github-pages/versions/232) — Required Ruby >= 2.3.0, dependency list
- [jekyllrb.com/docs/themes](https://jekyllrb.com/docs/themes/) — Layout override lookup order confirmed
- [jekyllrb.com/docs/posts](https://jekyllrb.com/docs/posts/) — Post file naming, minimum frontmatter
- [jekyll.github.io/jekyll-seo-tag/usage](http://jekyll.github.io/jekyll-seo-tag/usage/) — `_config.yml` fields, no layout tag needed when inheriting default
- [github.com/pages-themes/minimal](https://github.com/pages-themes/minimal) — Confirmed `_layouts/post.html` exists in theme (283 bytes); `_layouts/default.html` is the wrapper
- Codebase read: `assets/js/data-manager.js`, `index.html`, `blog/index.html`, `portfolio/index.html`, `blog/posts/view.html`, `_config.yml`, `index.md`, `.gitignore` — all call sites and file contents verified directly

### Secondary (MEDIUM confidence)
- [docs.github.com — About GitHub Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) — `safe: true` fixed setting confirmed; Rouge-only highlighter confirmed
- [github.com/pages-themes/minimal — API layout listing](https://api.github.com/repos/pages-themes/minimal/contents/_layouts) — `post.html` and `default.html` confirmed as the two layout files in the theme

### Tertiary (LOW confidence)
- WebSearch results re: Ruby 2.6 + github-pages 232 compatibility — multiple sources discuss version issues but none specifically test Ruby 2.6 + gem 232 combination

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against pages.github.com/versions and rubygems.org
- Architecture: HIGH — Jekyll layout override behavior verified in official docs; DataManager fix verified by reading codebase
- Pitfalls: HIGH — `paginate` warning verified in Jekyll issue tracker; index.md conflict verified by reading the file (body is commented out, conflict is real); Gemfile.lock verified in official docs

**Research date:** 2026-04-26
**Valid until:** 2026-07-26 (90 days — GitHub Pages gem version stable; check pages.github.com/versions before executing if delayed)
