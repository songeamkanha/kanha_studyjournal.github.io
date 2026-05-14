---
phase: "02-content-migration"
plan: "01"
subsystem: "content"
tags: [jekyll, posts, portfolio, seed-data]
dependency_graph:
  requires: []
  provides:
    - "_posts/2026-05-09-seed-post.md"
    - "_data/portfolio.yml"
  affects:
    - "blog/index.html (will loop over site.posts)"
    - "portfolio/index.html (will loop over site.data.portfolio)"
    - "index.html (will show latest 3 posts)"
tech_stack:
  added: []
  patterns:
    - "Jekyll _data/ autodiscovery — no _config.yml change required"
    - "D-08 post frontmatter schema (layout, title, date, tags, excerpt, featured)"
    - "D-06 portfolio item schema (title, description, tech[], repo, demo, featured)"
key_files:
  created:
    - "_posts/2026-05-09-seed-post.md"
    - "_data/portfolio.yml"
  modified: []
decisions:
  - "Used AI/ML themed content (attention mechanisms post, BERT classifier, ML tracker) per D-07 thematic guidance"
  - "Created _data/ directory which Jekyll 3.9.x autodiscovers without _config.yml changes"
  - "Set featured: true on Neural Text Classifier to exercise boolean field in future Liquid loops"
metrics:
  duration: "78 seconds"
  completed: "2026-05-09"
  tasks_completed: 2
  tasks_total: 2
  files_created: 2
  files_modified: 0
---

# Phase 02 Plan 01: Seed Content Files Summary

**One-liner:** Jekyll seed content committed — attention-mechanisms blog post and 2-item AI/ML portfolio YAML, both autodiscovered by Jekyll 3.9.x with no config changes.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create seed blog post | b9607af | `_posts/2026-05-09-seed-post.md` |
| 2 | Create _data/portfolio.yml | 0969e0d | `_data/portfolio.yml` |

## What Was Built

**Task 1 — Seed blog post** (`_posts/2026-05-09-seed-post.md`): A substantive 400-word post explaining transformer attention mechanisms — scaled dot-product attention, multi-head attention, and why attention replaced RNNs. Contains all five D-08 required frontmatter fields (`layout`, `title`, `date`, `tags`, `excerpt`) plus the optional `featured` field. Includes one math formula block and one Python code block. Jekyll will serve it at `/2026/05/09/seed-post/` via the `permalink: pretty` config.

**Task 2 — Portfolio data** (`_data/portfolio.yml`): Two AI/ML-themed placeholder projects using the full D-06 schema (`title`, `description`, `tech[]`, `repo`, `demo`, `featured`). Created the `_data/` directory which Jekyll 3.9.x autodiscovers automatically — no `_config.yml` changes required. Available in Liquid as `site.data.portfolio`.

## Verification Results

All automated checks passed:

- `_posts/2026-05-09-seed-post.md` exists with all 5 D-08 required fields
- `_data/portfolio.yml` exists with exactly 2 items (`^- title:` count = 2)
- Both files committed to git (not just staged)
- No `_config.yml` changes were made

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

The portfolio `repo` URLs point to GitHub repos that likely do not exist yet (`songeamkanha/neural-text-classifier`, `songeamkanha/ml-tracker`). The `demo` field is intentionally empty string on both items. These are placeholder values by design — no future plan is required to populate them before the site works, as Liquid templates will simply render empty/broken links which can be corrected when real projects exist.

## Threat Surface Scan

No new security-relevant surface introduced beyond what is in the plan's threat model. Both files are static committed content with no runtime input paths. The threat model's two accepted risks (YAML tampering via repo access, intentionally public post content) cover all surface created by this plan.

## Self-Check: PASSED

- `_posts/2026-05-09-seed-post.md` — FOUND
- `_data/portfolio.yml` — FOUND
- Commit `b9607af` — FOUND
- Commit `0969e0d` — FOUND
