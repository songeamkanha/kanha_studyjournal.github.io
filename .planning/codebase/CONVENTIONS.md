# Coding Conventions

**Analysis Date:** 2026-04-25

## Naming Patterns

**Files:**
- HTML pages: `index.html` (one per directory section)
- JavaScript modules: `kebab-case.js` (e.g., `data-manager.js`, `admin-config.js`, `content-loader.js`, `admin-link-handler.js`, `google-drive-backup.js`)
- CSS stylesheets: `kebab-case.css` (e.g., `style.css`, `admin.css`)
- Markdown content files: `kebab-case.md` (e.g., `sample-post.html`, `template.md`)

**Object/Module Names:**
- Singleton object modules use PascalCase: `DataManager`, `ContentLoader`, `BackupManager`, `AdminConfig`
- Defined as `const Name = { ... }` object literals, not classes

**Functions:**
- Top-level (standalone) functions use camelCase: `initTabs()`, `loadBlogPosts()`, `openBlogEditor()`, `closeBlogEditor()`, `escapeHtml()`, `formatDate()`, `showSuccessMessage()`
- Methods inside object literals use camelCase: `init()`, `getBlogPosts()`, `saveBlogPost()`, `deleteBlogPost()`, `isAdminEnabled()`, `requiresPassword()`

**Variables:**
- camelCase for local variables and parameters: `posts`, `listEl`, `postId`, `formData`, `sessionData`
- UPPER_SNAKE_CASE for constants within objects: `STORAGE_KEYS`, `BLOG_POSTS`, `PORTFOLIO`, `BACKGROUND`, `SESSION_KEY`, `ADMIN_ENABLED`, `ADMIN_PASSWORD`

**CSS Classes:**
- kebab-case for class names: `.item-card`, `.tab-btn`, `.tab-content`, `.success-message`, `.modal-close`, `.backup-bar`
- BEM-style suffixes where appropriate: `.item-card-content`, `.item-card-actions`, `.item-card-meta`

**HTML IDs:**
- kebab-case: `blog-posts-list`, `blog-editor-modal`, `blog-editor-form`, `portfolio-items-list`, `background-name`

## Code Style

**Formatting:**
- No formatter configuration file present (no `.prettierrc`, no `biome.json`, no ESLint config)
- 2-space indentation used throughout all `.js` files
- Single quotes used for string literals in JavaScript
- Template literals (backtick strings) used for multi-line HTML generation

**Linting:**
- No linting toolchain detected (no `.eslintrc*` files)
- VS Code settings only control Live Server port (`assets/js/main.js`, `.vscode/settings.json`)

**General JavaScript Style:**
- Vanilla ES6+ JavaScript — no transpiler, no bundler
- Arrow functions used for callbacks: `tabButtons.forEach(btn => { ... })`
- Regular `function` declarations for named top-level functions
- Optional chaining used: `DataManager.getBackgroundInfo()?.name`
- Nullish and OR fallback patterns: `post.title || ''`, `formData.get('link') || null`

## Import Organization

**Module Loading:**
- No ES module imports (`import`/`export`) — all scripts are loaded via `<script>` tags in HTML
- Load order in HTML follows dependency order:
  1. `admin-config.js` (no dependencies)
  2. `admin-link-handler.js` (depends on `AdminConfig`)
  3. `data-manager.js` (no dependencies)
  4. `content-loader.js` or `admin.js` (depends on `DataManager`)
  5. `google-drive-backup.js` (depends on `DataManager`)
- CDN scripts (Font Awesome, marked.js) loaded before local scripts via `<link>` or `<script src="cdn...">`

**Path Aliases:**
- None — relative paths only (e.g., `../../assets/css/style.css`)

## Error Handling

**Patterns:**
- `try/catch` blocks used for all `localStorage` reads in `data-manager.js`:
  ```javascript
  try {
    const posts = localStorage.getItem(this.STORAGE_KEYS.BLOG_POSTS);
    return posts ? JSON.parse(posts) : [];
  } catch (e) {
    console.error('Error loading blog posts:', e);
    return [];
  }
  ```
- Fallback return values (`[]`, `null`) used on catch — never throws upward
- Promise-based error handling in `google-drive-backup.js` using `resolve`/`reject`:
  ```javascript
  uploadBackup(file) {
    return new Promise((resolve, reject) => {
      reader.onerror = () => reject(new Error('Error reading file'));
    });
  }
  ```
- `alert()` used as last-resort error display for backup operations
- Guard-clause pattern: `if (!info) return;` used before DOM manipulation

## Logging

**Framework:** Native `console` only

**Patterns:**
- `console.error(message, error)` used for caught exceptions in `data-manager.js` and `google-drive-backup.js`
- `console.log("Hello from main.js")` in `main.js` — diagnostic stub, not a logging convention
- No structured logging, no log levels, no log aggregation

## Comments

**When to Comment:**
- Section headers used to divide logical blocks: `// Blog Posts`, `// Portfolio`, `// Background Info`, `// Utility functions`, `// Form handlers`
- Inline comments explain non-obvious logic: `// Sort by date (newest first)`, `// Update existing`, `// Create new`
- Warning comments with emoji for critical config flags: `// ⚠️ BEFORE PUBLISHING: Set to false`

**JSDoc/TSDoc:**
- Not used — no typed documentation annotations present

## Function Design

**Size:** Functions are single-responsibility and focused. `loadBlogPosts()`, `loadPortfolio()`, `loadBackgroundInfo()` each handle one data domain. Large HTML strings are generated inline with template literals.

**Parameters:** Most functions take zero or one parameter (`postId = null` with default). Form data extracted from `FormData` objects internally rather than passed as arguments.

**Return Values:**
- Data retrieval methods always return a value (`[]` or `null` as safe fallbacks)
- Write methods return the saved object: `saveBlogPost(post)` returns `post`
- Boolean-returning methods for auth checks: `isAdminEnabled()`, `requiresPassword()`, `isAuthenticated()`, `authenticate(password)`
- Void returns for DOM-mutating functions (`loadBlogPosts()`, `showSuccessMessage()`)

## Module Design

**Exports:**
- No ES module exports. All modules expose their singleton via a `const` in global scope:
  ```javascript
  const DataManager = { ... };
  const ContentLoader = { ... };
  const AdminConfig = { ... };
  const BackupManager = { ... };
  ```

**Barrel Files:**
- Not applicable — no module system. Script load order in HTML files acts as dependency declaration.

**Guard for Non-Browser Contexts:**
- Modules that use `window`/`localStorage` guard with: `if (typeof window !== 'undefined') { ... }`
- Modules dependent on another check existence: `if (typeof DataManager !== 'undefined') { ... }`

## HTML/CSS Conventions

**HTML:**
- Semantic elements used: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`, `<section>`
- Inline styles used in dynamically generated HTML (inside `admin-config.js` login/block screens)
- Navigation repeated verbatim across all HTML pages (no server-side include or templating)

**CSS:**
- CSS custom properties (variables) defined in `:root` in `assets/css/style.css`
- Variable names: `--primary-color`, `--secondary-color`, `--text-color`, `--light-text`, `--background`, `--light-background`, `--border-color`, `--transition`
- All colors and transitions reference variables — no hardcoded values in layout rules
- Admin-specific styles isolated to `assets/css/admin.css`

---

*Convention analysis: 2026-04-25*
