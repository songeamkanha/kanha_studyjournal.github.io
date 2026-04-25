# Architecture

**Analysis Date:** 2026-04-25

## Pattern Overview

**Overall:** Static HTML site with client-side JavaScript CMS

**Key Characteristics:**
- No build step — all files are served directly as-is (HTML, CSS, JS)
- Jekyll configuration exists (`_config.yml`) but is unused; the live site is fully vanilla HTML
- Content persistence via browser `localStorage` — no server-side database or API
- Admin panel is a self-contained HTML/JS UI, gated by a client-side config flag
- External CDN dependencies for icons (Font Awesome) and markdown rendering (marked.js)

## Layers

**Presentation Layer:**
- Purpose: HTML pages that define page structure and navigation
- Location: `index.html`, `blog/index.html`, `portfolio/index.html`, `admin/index.html`, `blog/posts/view.html`
- Contains: Semantic HTML, navigation, placeholder containers for dynamic content
- Depends on: CSS layer, JavaScript layer
- Used by: Browser (end user)

**Styling Layer:**
- Purpose: Visual styling for all pages
- Location: `assets/css/style.css`, `assets/css/admin.css`
- Contains: CSS custom properties (design tokens), component styles, layout rules
- Depends on: Nothing (pure CSS)
- Used by: All HTML pages via `<link>` tags

**Data Layer (localStorage):**
- Purpose: Persists all site content in the browser between sessions
- Location: Browser `localStorage` managed by `assets/js/data-manager.js`
- Contains: Blog posts (`blog_posts`), portfolio items (`portfolio_items`), background info (`background_info`)
- Depends on: Nothing (browser native API)
- Used by: `DataManager` singleton object

**Application Logic Layer:**
- Purpose: CRUD operations, data serialization, and initialization
- Location: `assets/js/data-manager.js`
- Contains: `DataManager` singleton — get/save/delete for blog posts, portfolio items, background info; export/import for backup
- Depends on: `localStorage`
- Used by: `ContentLoader`, `admin.js`

**Content Rendering Layer:**
- Purpose: Reads from `DataManager` and injects HTML into the DOM
- Location: `assets/js/content-loader.js`
- Contains: `ContentLoader` singleton — renders blog lists, portfolio grids, blog post detail, homepage previews
- Depends on: `DataManager`, `marked.js` (optional, CDN)
- Used by: All public-facing pages

**Admin UI Layer:**
- Purpose: Forms and modals for creating/editing content
- Location: `admin/index.html`, `assets/js/admin.js`, `assets/js/google-drive-backup.js`
- Contains: Tab UI, modal editors for posts and portfolio items, background info form, backup/restore controls
- Depends on: `DataManager`, `AdminConfig`, `BackupManager`
- Used by: Site owner only

**Auth/Guard Layer:**
- Purpose: Controls admin page access and admin link visibility
- Location: `assets/js/admin-config.js`, `assets/js/admin-link-handler.js`
- Contains: `AdminConfig` singleton — enable/disable flag, optional password, `sessionStorage`-based session (24hr TTL)
- Depends on: `sessionStorage`
- Used by: `admin/index.html` (page guard), all pages with nav (link visibility)

## Data Flow

**Public Page Load (e.g., blog index):**

1. Browser loads `blog/index.html` — DOM has empty containers
2. `admin-config.js` executes synchronously, defining `AdminConfig`
3. `admin-link-handler.js` runs on `DOMContentLoaded`, hiding admin nav link if `AdminConfig.ADMIN_ENABLED === false`
4. `data-manager.js` defines `DataManager`, immediately calls `DataManager.init()` to seed defaults if `localStorage` is empty
5. `content-loader.js` defines `ContentLoader`
6. Inline `<script>` at page bottom calls `ContentLoader.loadBlogPosts()` on `DOMContentLoaded`
7. `ContentLoader` calls `DataManager.getBlogPosts()`, reads from `localStorage`, returns array
8. `ContentLoader` renders HTML cards into `#blog-posts-list`

**Blog Post View:**

1. Browser loads `blog/posts/view.html`
2. Same script stack loads (admin-config, data-manager)
3. `marked.min.js` loaded from CDN (`cdn.jsdelivr.net`)
4. Inline script reads `?id=` query parameter from URL
5. Calls `DataManager.getBlogPost(id)` to fetch post object from `localStorage`
6. Renders post HTML into `.blog-post-content`; if `marked` is available, passes content through `marked.parse()` for Markdown rendering

**Admin Content Edit:**

1. Browser loads `admin/index.html`
2. `admin-config.js` loads first; inline `<script>` calls `AdminConfig.protectAdminPage()`
3. If admin disabled: replaces `document.body` with a locked screen
4. If password required and not authenticated: replaces `document.body` with login form
5. If authenticated: remaining scripts (`data-manager.js`, `google-drive-backup.js`, `admin.js`) load
6. `admin.js` calls `DataManager.getBlogPosts()`, `DataManager.getPortfolio()`, `DataManager.getBackgroundInfo()` and populates tab UI
7. User edits trigger form submit events → `DataManager.saveBlogPost(post)` / `DataManager.savePortfolioItem(item)` / `DataManager.saveBackgroundInfo(info)` → writes to `localStorage`
8. Admin reloads list by calling `loadBlogPosts()` / `loadPortfolio()` again

**Backup/Restore:**

1. "Download Backup" → `BackupManager.downloadBackup()` → `DataManager.exportData()` → JSON blob download
2. "Upload & Restore" → file picker → `BackupManager.uploadBackup(file)` → validates structure → `DataManager.importData(data)` → page reload

**State Management:**
- All persistent state lives in `localStorage` under three keys: `blog_posts`, `portfolio_items`, `background_info`
- Session state for admin authentication lives in `sessionStorage` under `admin_authenticated`
- No reactive state management; DOM is re-rendered by re-calling load functions after mutations

## Key Abstractions

**DataManager (`assets/js/data-manager.js`):**
- Purpose: Single source of truth for reading and writing all content
- Pattern: Module object / singleton literal
- Key methods: `getBlogPosts()`, `saveBlogPost(post)`, `deleteBlogPost(id)`, `getBlogPost(id)`, `getPortfolio()`, `savePortfolioItem(item)`, `deletePortfolioItem(id)`, `getBackgroundInfo()`, `saveBackgroundInfo(info)`, `exportData()`, `importData(data)`

**ContentLoader (`assets/js/content-loader.js`):**
- Purpose: Bridges `DataManager` data to DOM rendering on public pages
- Pattern: Module object / singleton literal
- Key methods: `loadBlogPosts()`, `loadHomepageBlogPosts()`, `loadPortfolio()`, `loadHomepagePortfolio()`, `loadBlogPost()`, `loadBackgroundInfo()`

**AdminConfig (`assets/js/admin-config.js`):**
- Purpose: Feature flag and authentication guard for the admin panel
- Pattern: Module object / singleton literal
- Key properties: `ADMIN_ENABLED` (boolean flag), `ADMIN_PASSWORD` (string, empty = no password)
- Key methods: `isAdminEnabled()`, `authenticate(password)`, `isAuthenticated()`, `protectAdminPage()`, `shouldShowAdminLink()`

**BackupManager (`assets/js/google-drive-backup.js`):**
- Purpose: Handles data portability via JSON file download/upload
- Pattern: Module object / singleton literal
- Key methods: `downloadBackup()`, `uploadBackup(file)`, `validateBackupData(data)`

## Entry Points

**Homepage:**
- Location: `index.html`
- Triggers: Direct browser navigation to `/`
- Responsibilities: Hero section, featured projects preview (2 items), latest blog posts preview (3 items), contact section

**Blog Index:**
- Location: `blog/index.html`
- Triggers: Navigation to `/blog/`
- Responsibilities: Render full blog post listing from `localStorage`

**Blog Post Viewer:**
- Location: `blog/posts/view.html`
- Triggers: Navigation to `/blog/posts/view.html?id={timestamp-id}`
- Responsibilities: Render single post with Markdown parsing

**Portfolio:**
- Location: `portfolio/index.html`
- Triggers: Navigation to `/portfolio/`
- Responsibilities: Render full portfolio grid from `localStorage`

**Admin Dashboard:**
- Location: `admin/index.html`
- Triggers: Navigation to `/admin/`
- Responsibilities: Authenticate, manage blog posts, portfolio items, and background info; backup/restore

## Error Handling

**Strategy:** Defensive defaults with silent fallback

**Patterns:**
- `DataManager` wraps all `localStorage` reads in `try/catch`; returns empty arrays or `null` on parse errors
- `ContentLoader` checks for DOM element existence before manipulating (`if (!element) return`)
- `blog/posts/view.html` renders "Post Not Found" HTML when `id` param is missing or `DataManager` returns nothing
- `BackupManager.uploadBackup()` returns a Promise; rejects with descriptive `Error` on invalid JSON or format mismatch
- `AdminConfig.isAuthenticated()` wraps `sessionStorage.getItem` in `try/catch` and returns `false` on error

## Cross-Cutting Concerns

**Logging:** `console.error()` in `DataManager` on `localStorage` parse failures; `console.log()` in `main.js` (stub)

**Validation:** HTML5 `required` attributes on all admin forms; `BackupManager.validateBackupData()` checks for expected top-level array/object keys before import

**Authentication:** `AdminConfig` singleton with `sessionStorage`-backed session; admin page performs synchronous check before loading content scripts; nav links hidden via `admin-link-handler.js` on every public page

**HTML Injection Safety:** All user-supplied content rendered via `escapeHtml()` helper (creates a `<div>`, sets `textContent`, reads back `innerHTML`); Markdown content passed through `marked.parse()` only after escaping

---

*Architecture analysis: 2026-04-25*
