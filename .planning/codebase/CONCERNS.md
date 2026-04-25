# Concerns

> Last mapped: 2026-04-25

## Security (Critical)

### Admin Panel — No Real Authentication
- **File:** `assets/js/admin-config.js`
- `ADMIN_ENABLED: true` and `ADMIN_PASSWORD: ''` are committed — admin is wide open on the published site
- All auth is client-side JavaScript only, trivially bypassable via browser DevTools
- **Risk:** Anyone can access admin features on the live GitHub Pages site

### XSS Injection in Content Loader
- **File:** `assets/js/content-loader.js` line ~205
- `post.content` is injected via `innerHTML` without escaping
- A separate (safer) path exists in `blog/posts/view.html` — two parallel renderers with different XSS safety
- **Risk:** Stored XSS if any post content contains malicious HTML

### No CSP or SRI
- No Content Security Policy headers configured
- CDN assets loaded without Subresource Integrity (Font Awesome from cdnjs, `marked` from jsdelivr)
- **Risk:** Supply chain injection from compromised CDN

## Tech Debt

### Duplicate Initialization
- `DataManager.init()` auto-called on import in `data-manager.js` AND manually called in each page's `DOMContentLoaded`
- Results in double initialization on every page load

### Copy-Pasted Utilities
- `escapeHtml` and `formatDate` duplicated across 3+ files and have already diverged
- Should be consolidated into a shared `utils.js`

### Two Blog Post Rendering Paths
- `ContentLoader.loadBlogPost()` in `assets/js/content-loader.js`
- Inline script in `blog/posts/view.html`
- Differ in XSS handling — the view.html path is safer

### Empty Main Script
- `assets/js/main.js` is a single `console.log` line, wasting an HTTP request

### Unfilled Template Placeholders in Config
- **File:** `_config.yml`
- Contains `your_twitter_handle`, `Your Name`, and `kanha_studyjournal.github.io` (underscore is invalid in a domain)
- Site may render with placeholder values

### Broken Index
- `index.md` coexists with `index.html` (Jekyll conflict)
- Links in `index.md` point to non-existent pages (`projects.md`, `blog.md`)

### Template Files Publicly Served
- `blog/posts/sample-post.html`, `blog/posts/post-template.html`, `blog/posts/template.md` are served publicly
- Not excluded from Jekyll build

## Bugs

### Empty Portfolio Silently Clears UI
- `loadHomepagePortfolio()` clears static placeholder cards when localStorage has no portfolio items
- Shows a blank section instead of the placeholder — no empty state

## Missing Basics

| Missing | Impact |
|---------|--------|
| Favicon | Browser tab shows blank icon |
| Open Graph tags | No preview cards when shared on social |
| `robots.txt` | Search crawlers have no guidance |
| `sitemap.xml` | Search indexing is less efficient |
| Any tests | No regression safety net |

## Priority Order

1. **Admin auth** — client-side only auth on a public site is a critical gap
2. **XSS in content-loader** — consolidate to the safer view.html rendering path
3. **Duplicate utilities** — extract shared `utils.js` to prevent further divergence
4. **Config placeholders** — fill `_config.yml` before next publish
5. **Broken index.md links** — remove or fix non-existent page references
