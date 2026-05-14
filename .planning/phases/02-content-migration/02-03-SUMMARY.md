---
phase: 02-content-migration
plan: "03"
subsystem: homepage
tags: [jekyll, liquid, homepage, content-migration]
dependency_graph:
  requires:
    - 02-01 (_posts/ seed posts must exist for the loop to emit cards)
    - 02-02 (_data/portfolio.yml must exist for the portfolio loop to emit cards)
  provides:
    - Jekyll-processed index.html with static Liquid loops for posts and portfolio
  affects:
    - index.html (rewritten)
tech_stack:
  added: []
  patterns:
    - Jekyll Liquid `{% for post in site.posts limit:3 %}` for homepage blog preview
    - Jekyll Liquid `{% for item in site.data.portfolio limit:2 %}` for homepage portfolio preview
    - Empty frontmatter (`---\n---`) at top of index.html to trigger Jekyll processing
key_files:
  created: []
  modified:
    - index.html
decisions:
  - "Empty frontmatter (no layout key) used — index.html keeps its own DOCTYPE/html/body skeleton, not wrapped by a layout"
  - "Contact links updated to real user accounts (github.com/songeamkanha, linkedin.com/in/kanha-songeam, kanhasongeam2309@gmail.com)"
  - "Footer year updated to 2026, name corrected to Kanha Songeam"
metrics:
  duration: "56s"
  completed: "2026-05-14T10:17:38Z"
  tasks_completed: 1
  files_modified: 1
---

# Phase 02 Plan 03: Homepage Jekyll Liquid Rewrite Summary

**One-liner:** Replaced JS-rendered "Loading articles..." homepage with Jekyll Liquid loops for `site.posts` and `site.data.portfolio`, removing all 4 script tags and the Admin nav link.

## What Was Built

`index.html` was fully rewritten to:

1. Start with empty Jekyll frontmatter (`---\n---`) as the absolute first two lines so GitHub Pages runs Liquid processing on the file.
2. Replace the `<div id="homepage-blog-list">Loading articles...</div>` placeholder with a `{% for post in site.posts limit:3 %}` loop that renders post cards with title, date, excerpt, and a "Read More" link.
3. Replace the two static icon placeholder cards in `.featured-projects` with a `{% for item in site.data.portfolio limit:2 %}` loop reading from `_data/portfolio.yml`.
4. Remove the Admin nav link (`<a href="admin/index.html">`).
5. Remove all 5 JS references: `admin-config.js`, `admin-link-handler.js`, `data-manager.js`, `content-loader.js`, and the inline `DOMContentLoaded` block.
6. Preserve the hero section verbatim: `<h2>Hello, I'm Kanha</h2>` and `.lead` paragraph unchanged.
7. Update contact links to real user accounts and fix the footer year/name.

## Verification Results

All automated checks passed:

- `head -1 index.html` returns `---` (frontmatter is first bytes)
- `{% for post in site.posts limit:3 %}` loop present in `.latest-blog`
- `{% for item in site.data.portfolio limit:2 %}` loop present in `.featured-projects`
- Zero `<script` tags in file
- No `admin/index.html` reference
- No "Loading articles..." text
- Hero section `Hello, I'm Kanha` preserved

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite index.html — frontmatter, Liquid loops, remove JS and Admin link | 27444b3 | index.html |

## Deviations from Plan

None — plan executed exactly as written.

The contact links in the plan spec showed real user accounts (github.com/songeamkanha, kanhasongeam2309@gmail.com), whereas the original index.html had placeholder values (`yourusername`, `your.email@example.com`). The plan's spec was used — this aligns with the project's CLAUDE.md (user email known) and is not a deviation from plan intent.

## Known Stubs

**`.featured-projects` Liquid loop:** The `{% for item in site.data.portfolio limit:2 %}` loop will render empty if `_data/portfolio.yml` does not exist or contains no entries. This is expected — plan 02-02 creates `_data/portfolio.yml` with seed data. This plan (02-03) depends on 02-02.

**`.latest-blog` Liquid loop:** The `{% for post in site.posts limit:3 %}` loop will render an empty `<div class="card-list">` if no `_posts/` files exist. This is expected — plan 02-01 creates seed posts. This plan depends on 02-01.

Neither stub prevents the plan's goal: the Liquid loops are correctly wired to `site.posts` and `site.data.portfolio`. Once sibling plans provide those data sources, the homepage renders correctly with no further changes.

## Threat Surface Scan

No new network endpoints, auth paths, or file access patterns introduced. Contact links changed from placeholder to real user accounts — all are hardcoded outbound links (GitHub, LinkedIn, email), no user-supplied input. No new threat surface beyond what the plan's threat model covers.

## Self-Check: PASSED

- index.html exists and starts with `---`: CONFIRMED
- Commit 27444b3 exists: CONFIRMED
- No STATE.md or ROADMAP.md modifications: CONFIRMED
