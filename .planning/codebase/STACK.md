# Technology Stack

**Analysis Date:** 2026-04-25

## Languages

**Primary:**
- HTML5 - All page templates (`index.html`, `blog/index.html`, `portfolio/index.html`, `admin/index.html`, `blog/posts/view.html`, `blog/posts/sample-post.html`)
- CSS3 - Styling (`assets/css/style.css`, `assets/css/admin.css`)
- Vanilla JavaScript (ES6+) - All client-side logic (`assets/js/*.js`)

**Secondary:**
- Markdown - Blog post content and static pages (`about.md`, `index.md`, `blog/posts/template.md`)

## Runtime

**Environment:**
- Static site - No server-side runtime. Pages are served as plain HTML/CSS/JS files.
- Hosting target: GitHub Pages (static hosting)

**Package Manager:**
- None - No npm, yarn, or other package manager. All dependencies loaded from CDN.
- Lockfile: Not applicable

## Frameworks

**Core:**
- None - Pure vanilla HTML/CSS/JavaScript, no frontend framework (no React, Vue, Angular, etc.)

**Static Site Generator:**
- Jekyll (configured via `_config.yml`) - Primarily for GitHub Pages compatibility and Markdown rendering for `.md` files. The main site functionality uses custom JS, not Jekyll templates.
  - Theme: `jekyll-theme-minimal`
  - Markdown processor: kramdown
  - Syntax highlighter: rouge
  - Config: `_config.yml`

**Testing:**
- Not detected - No test framework or test files present.

**Build/Dev:**
- VS Code Live Server (port 5501) - Local development server configured in `.vscode/settings.json`
- Jekyll (GitHub Pages build pipeline) - Processes `.md` files and applies theme on deploy

## Key Dependencies

**Loaded via CDN (no local install required):**
- Font Awesome 6.0.0 - Icon library, loaded from `cdnjs.cloudflare.com` on every HTML page
  - URL: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`
- marked.js (latest) - Markdown-to-HTML parser, loaded from `cdn.jsdelivr.net`
  - Statically in `blog/posts/view.html`: `https://cdn.jsdelivr.net/npm/marked/marked.min.js`
  - Dynamically injected by `assets/js/markdown.js` as a script tag

**Local JavaScript modules (no npm packages):**
- `assets/js/admin-config.js` - Admin access control and session management
- `assets/js/admin-link-handler.js` - Hides/shows admin nav links based on config
- `assets/js/admin.js` - Admin dashboard UI logic (CRUD forms for blog/portfolio)
- `assets/js/data-manager.js` - LocalStorage read/write layer (blog posts, portfolio, background)
- `assets/js/content-loader.js` - Reads from DataManager and renders content into HTML pages
- `assets/js/google-drive-backup.js` - Manual JSON backup download/upload (no actual Google API)
- `assets/js/main.js` - Stub file (currently only a console.log)
- `assets/js/markdown.js` - Dynamically loads marked.js and processes `.markdown-content` elements

## Configuration

**Environment:**
- No environment variables. All configuration is hardcoded in source files.
- Admin config: `assets/js/admin-config.js` — `ADMIN_ENABLED` flag and `ADMIN_PASSWORD` string literal
- Site metadata: `_config.yml` — title, description, author, navigation, Jekyll plugins

**Build:**
- `_config.yml` - Jekyll build configuration
- No Webpack, Vite, Rollup, or other bundler present

## Platform Requirements

**Development:**
- Any browser with a local file server (e.g., VS Code Live Server on port 5501)
- Optional: Ruby + Jekyll for local Jekyll builds

**Production:**
- GitHub Pages (static hosting, Jekyll build triggered on push to `main`)
- No server, database, or runtime process required
- All data persisted in browser's `localStorage`

---

*Stack analysis: 2026-04-25*
