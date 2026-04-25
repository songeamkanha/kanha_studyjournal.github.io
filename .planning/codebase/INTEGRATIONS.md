# External Integrations

**Analysis Date:** 2026-04-25

## APIs & External Services

**Icon Library:**
- Font Awesome 6.0.0 - Provides all UI icons (nav, cards, admin panel, social links)
  - SDK/Client: CDN stylesheet link (no JS API)
  - Auth: None (public CDN)
  - URL: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`
  - Used in: `index.html`, `blog/index.html`, `portfolio/index.html`, `admin/index.html`, `blog/posts/view.html`, `blog/posts/sample-post.html`, and injected inline by `assets/js/admin-config.js`

**Markdown Parser:**
- marked.js (unpinned, always loads latest) - Converts Markdown content to HTML for blog post rendering
  - SDK/Client: CDN script tag
  - Auth: None (public CDN)
  - URL: `https://cdn.jsdelivr.net/npm/marked/marked.min.js`
  - Used in: `blog/posts/view.html` (static), `assets/js/markdown.js` (dynamic injection)
  - Called as: `marked.parse(markdownText)` in `assets/js/content-loader.js`

## Data Storage

**Databases:**
- None - No external database

**Browser LocalStorage (primary data store):**
- All content (blog posts, portfolio items, background info) stored in browser localStorage
- Client: `assets/js/data-manager.js` — `DataManager` object wraps all `localStorage.getItem` / `localStorage.setItem` calls
- Storage keys defined in `DataManager.STORAGE_KEYS`:
  - `blog_posts` - Array of blog post objects
  - `portfolio_items` - Array of portfolio item objects
  - `background_info` - Object with site owner profile data
- Data is device-specific and not shared across browsers or devices

**File Storage:**
- No cloud file storage
- Backup files are downloaded as JSON to the user's local filesystem from `assets/js/google-drive-backup.js`

**Caching:**
- Browser localStorage serves as both persistent storage and cache (no separate caching layer)

## Authentication & Identity

**Auth Provider:**
- Custom (client-side only) — no third-party auth provider
  - Implementation: `assets/js/admin-config.js`
  - Admin enabled/disabled by `AdminConfig.ADMIN_ENABLED` boolean (hardcoded in source)
  - Optional password stored as plaintext string in `AdminConfig.ADMIN_PASSWORD` (hardcoded in source)
  - Session stored in `sessionStorage` under key `admin_authenticated`, expires after 24 hours
  - No server-side validation — security relies entirely on client-side JS

## Monitoring & Observability

**Error Tracking:**
- None - No Sentry, Datadog, or similar service

**Logs:**
- `console.error()` used in `assets/js/data-manager.js` and `assets/js/google-drive-backup.js` for catch blocks
- `console.log()` stub in `assets/js/main.js`
- No structured logging or log aggregation

## CI/CD & Deployment

**Hosting:**
- GitHub Pages — site deployed from the `main` branch
- Target URL configured in `_config.yml`: `https://kanha_studyjournal.github.io`
- Jekyll build runs automatically on push via GitHub's built-in Pages pipeline

**CI Pipeline:**
- GitHub Actions (implicit via GitHub Pages) — no custom `.github/workflows/` files present
- No lint, test, or build steps in CI

## Environment Configuration

**Required env vars:**
- None — the project has no environment variables whatsoever
- All configuration is hardcoded in `assets/js/admin-config.js` and `_config.yml`

**Secrets location:**
- Admin password is stored as a plaintext JavaScript string literal in `assets/js/admin-config.js` — this file is committed to the repository
- `.gitignore` excludes `admin-config.local.js` as a pattern for local overrides, but this convention is not enforced by tooling

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Google Drive (Documented but Not Integrated)

- `assets/js/google-drive-backup.js` is named for Google Drive but does NOT use the Google Drive API
- Actual behavior: generates a JSON file download in the browser (`Blob` + `URL.createObjectURL`)
- User is instructed to manually upload the downloaded file to Google Drive via browser
- No OAuth, no Google API client, no Drive SDK calls

## Social Links (Placeholder Only)

The following external profile links appear in `index.html` and `assets/js/data-manager.js` as placeholder values:
- GitHub: `https://github.com/yourusername`
- LinkedIn: `https://linkedin.com/in/yourusername`
- Email: `your.email@example.com`

These are user-configurable via the admin dashboard (stored in `localStorage`) and do not represent active integrations.

---

*Integration audit: 2026-04-25*
