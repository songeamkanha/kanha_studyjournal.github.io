# kanha_studyjournal.github.io

Personal Portfolio & Blog Website

## Features

- 🎨 Modern, responsive design
- 📝 Blog posts management with Markdown support
- 💼 Portfolio showcase
- 🔐 Admin dashboard for content management
- ☁️ Backup & restore functionality
- 🔒 Admin access control for public publishing

## Setup

1. Clone this repository
2. Open `index.html` in your browser to view locally
3. Access admin panel at `/admin/index.html` for content management

## Documentation

- `ADMIN_README.md` - Admin dashboard guide
- `PUBLISH_GUIDE.md` - Guide for publishing your website safely

## Important Files

- `assets/js/admin-config.js` - Admin access configuration (disable before publishing!)
- `.gitignore` - Excludes backup files and system files from Git

## Before Publishing

**⚠️ IMPORTANT:** Disable admin access before publishing:
1. Open `assets/js/admin-config.js`
2. Set `ADMIN_ENABLED: false`
3. Save and commit

See `PUBLISH_GUIDE.md` for detailed instructions.
