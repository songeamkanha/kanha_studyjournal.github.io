# Kanha Study Journal

## What This Is

A personal portfolio and study journal hosted on GitHub Pages. The site is the public face of Kanha's ongoing learning — a place where rough notes become readable posts, explorations get documented, and projects are showcased. It's meant to feel warm and personal, not like a generic template, and easy enough to keep updated without touching code.

## Core Value

Anyone can visit and read what Kanha is learning and building — posts are public, discoverable, and worth reading.

## Requirements

### Validated

- ✓ Static site hosted on GitHub Pages — existing
- ✓ Blog post listing and single-post viewer — existing
- ✓ Portfolio section — existing
- ✓ Admin panel for content management — existing
- ✓ Markdown rendering for post content — existing

### Active

- [ ] Blog posts are stored as committed markdown files (not localStorage) — visible to all visitors
- [ ] Warm, personal design across homepage, blog, and portfolio
- [ ] AI-assisted drafting: rough notes input → Claude generates structured post → user reviews before publishing
- [ ] Easy publish workflow: no code changes required to add a post
- [ ] Portfolio items are public and persisted (not localStorage-only)
- [ ] Homepage showcases both blog and portfolio in one cohesive view

### Out of Scope

- Comments or social features — adds complexity, not needed for v1
- Authentication/login for readers — site is fully public
- Custom domain — can be added later without code changes
- Automatic publishing without review — user explicitly wants to review every AI-drafted post

## Context

**Existing codebase:** Static HTML/CSS/Vanilla JS site. Data currently stored in browser localStorage — this means posts are device-specific and not visible to other visitors. This is the most critical architectural gap to close.

**Hosting:** GitHub Pages with Jekyll config (used for `.md` rendering and GitHub Actions build pipeline). The main site uses custom JS, not Jekyll templates.

**No build tooling:** No npm, no bundler. All dependencies via CDN. This constraint should be preserved — it keeps deployment simple.

**AI drafting pipeline:** User writes rough notes → feeds to Claude API → Claude returns a structured markdown blog post → user reviews/edits → commits the `.md` file → GitHub Pages deploys. The pipeline is a local or lightweight tool, not a CMS.

**Key codebase insight (brownfield):** `DataManager` uses localStorage as the data layer. The blog and portfolio pages read from this. For public visibility, the shift is from localStorage → committed markdown/JSON files in the repo.

## Constraints

- **Tech stack**: Vanilla HTML/CSS/JS — no framework, no bundler, no npm. Keep it simple.
- **Hosting**: GitHub Pages (static). No server-side runtime, no database.
- **Content format**: Markdown files committed to git for blog posts (GitHub Pages renders these natively via Jekyll).
- **AI model**: Claude API (Anthropic) for the drafting pipeline.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Shift from localStorage to committed files for blog posts | localStorage is device-specific; public GitHub Pages site needs content in the repo | — Pending |
| AI drafting via Claude API, not embedded in site | Simpler: a local script feeds notes to Claude, outputs a markdown file. No API keys in the browser. | — Pending |
| Keep vanilla JS / no framework | Existing codebase has no build step; adding a framework adds deployment complexity for no clear gain | — Pending |
| User reviews every AI-generated post before publishing | User explicitly chose this — prevents low-quality auto-posts | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-25 after initialization*
