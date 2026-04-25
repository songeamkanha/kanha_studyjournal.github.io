# Structure

> Last mapped: 2026-04-25

## Directory Tree

```
kanha_studyjournal.github.io/
├── index.html              # Public landing page
├── index.md                # Jekyll markdown entry (may coexist with index.html)
├── about.md                # About page (Jekyll-rendered)
├── _config.yml             # Jekyll configuration
├── .gitignore
├── README.md               # Developer-facing project overview
├── ADMIN_README.md         # Admin panel usage instructions
├── PUBLISH_GUIDE.md        # Deployment/publishing guide
│
├── admin/
│   └── index.html          # Admin panel SPA entry point
│
├── blog/
│   ├── index.html          # Blog listing page
│   └── posts/
│       ├── post-template.html  # HTML template for new posts
│       ├── sample-post.html    # Example post
│       ├── template.md         # Markdown post template
│       └── view.html           # Single post viewer
│
├── portfolio/
│   └── index.html          # Portfolio listing page
│
└── assets/
    ├── css/
    │   ├── style.css        # Public-facing styles (shared)
    │   └── admin.css        # Admin panel styles
    └── js/
        ├── data-manager.js       # Core data layer — localStorage CRUD
        ├── admin-config.js       # Admin auth (PIN), session management
        ├── admin.js              # Admin panel controller (UI logic)
        ├── admin-link-handler.js # Admin navigation/link routing
        ├── content-loader.js     # Dynamic content rendering (public)
        ├── main.js               # Public page bootstrap
        ├── markdown.js           # Markdown → HTML renderer
        └── google-drive-backup.js # Google Drive backup integration
```

## Key File Locations

| Purpose | Path |
|---------|------|
| Public entry point | `index.html` |
| Admin entry point | `admin/index.html` |
| Jekyll config | `_config.yml` |
| Core data layer | `assets/js/data-manager.js` |
| Admin auth | `assets/js/admin-config.js` |
| Public styles | `assets/css/style.css` |
| Admin styles | `assets/css/admin.css` |
| Backup integration | `assets/js/google-drive-backup.js` |

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| HTML files | lowercase, `index.html` per section | `admin/index.html` |
| CSS files | lowercase, hyphenated | `admin.css`, `style.css` |
| JS files | lowercase, hyphenated | `data-manager.js`, `admin-config.js` |
| JS module objects | PascalCase singleton `const` | `const DataManager = { ... }` |
| JS methods | camelCase | `DataManager.getEntries()` |
| JS constants | UPPER_SNAKE_CASE (within objects) | `STORAGE_KEY` |
| Directories | lowercase | `admin/`, `assets/`, `blog/` |

## Script Load Order (Dependency Declaration)

**Public pages** (`index.html`, `blog/index.html`, etc.):
1. `data-manager.js` — data layer, no deps
2. `markdown.js` — renderer, no deps
3. `content-loader.js` — depends on DataManager + markdown
4. `main.js` — bootstraps everything

**Admin page** (`admin/index.html`):
1. `data-manager.js`
2. `admin-config.js` — depends on DataManager (localStorage)
3. `admin-link-handler.js`
4. `google-drive-backup.js` — depends on DataManager
5. `admin.js` — depends on all above

## Where to Add New Code

| Task | Where |
|------|-------|
| New public page | Create `{section}/index.html`, add nav link in `index.html` |
| New data entity | Add CRUD methods to `assets/js/data-manager.js` |
| New admin feature | Add UI to `admin/index.html`, logic to `assets/js/admin.js` |
| New public styles | `assets/css/style.css` (use existing CSS custom properties) |
| New admin styles | `assets/css/admin.css` |
| New JS utility | Add to most relevant existing module or create `assets/js/{name}.js` |
| New blog post | Copy `blog/posts/post-template.html` to new file |
