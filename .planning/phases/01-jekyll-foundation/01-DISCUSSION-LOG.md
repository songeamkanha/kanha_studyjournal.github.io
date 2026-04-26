# Phase 1: Jekyll Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 01-jekyll-foundation
**Areas discussed:** _config.yml real values, DataManager double-init fix, _layouts/post.html scope

---

## _config.yml real values

| Option | Description | Selected |
|--------|-------------|----------|
| https://songeamkanha.github.io | Derived from git user config (songeamkanha) | ✓ |
| https://kanha-studyjournal.github.io | If repo named kanha-studyjournal.github.io | |
| https://kanhasongeam.github.io | If GitHub username is kanhasongeam | |

**User's choice:** `https://songeamkanha.github.io`
**Notes:** Confirmed by user as the correct GitHub Pages URL.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Fill with real handles | Replace placeholders with actual social handles/email | |
| Strip them out | Remove social_links and author.email sections entirely | ✓ |
| Stub with TBD | Replace placeholders with 'TODO' | |

**User's choice:** Strip social_links and author.email out entirely
**Notes:** Can be added back later when the site is ready to promote.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Songeam Kanha | Full name from DataManager defaults | |
| Kanha Songeam | Western name order | ✓ |
| kanhasongeam | Username-style | |

**User's choice:** `Kanha Songeam`

---

| Option | Description | Selected |
|--------|-------------|----------|
| Kanha's Study Journal | Matches project brand | ✓ |
| Kanha Songeam — Study Journal | More personal, name up front | |
| You decide | Claude picks | |

**User's choice:** `Kanha's Study Journal`

---

## DataManager double-init fix

| Option | Description | Selected |
|--------|-------------|----------|
| Guard flag inside init() | Add _initialized check — idempotent, one-line change | ✓ |
| Remove auto-call at line 160 | Delete auto-call, rely on page-level calls | |

**User's choice:** Guard flag inside `init()` — add `if (this._initialized) return; this._initialized = true;`
**Notes:** Chose for minimal blast radius — no HTML files touched, guards against any future double-call too.

---

## _layouts/post.html scope

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal skeleton | title + date + content, no CDN, no nav | ✓ |
| Forward-looking stub | Same + Lora/Inter CDN link placeholder | |

**User's choice:** Minimal skeleton — Phase 3 replaces the layout entirely.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Just the post content | No nav — validates Jekyll routing cleanly | ✓ |
| Include basic nav links | Header with Home/Blog links | |

**User's choice:** No navigation in Phase 1 post layout.

---

## Claude's Discretion

- Test post content for INFRA-01 validation
- `_config.yml` description text
- Whether to add `_posts/.gitkeep` or commit test post directly

## Deferred Ideas

- Lora/Inter font CDN links in `_layouts/post.html` → Phase 3
- Site nav in post layout → Phase 3
- Social profile links in `_config.yml` → add when site is ready to promote
