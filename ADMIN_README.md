# Admin Dashboard Guide

## Overview
Your website now has a built-in admin dashboard that allows you to manage all your content directly from the browser UI. You can edit blog posts, portfolio items, and background information without manually editing HTML files.

## Accessing the Admin Dashboard

1. Navigate to your website
2. Click the "Admin" link in the navigation menu (or go to `/admin/index.html`)
3. The admin dashboard will open with three tabs:
   - **Blog Posts**: Manage your blog posts
   - **Portfolio**: Manage your portfolio projects
   - **Background Info**: Edit your personal information

## Features

### Blog Posts Management

**Creating a New Blog Post:**
1. Go to the "Blog Posts" tab
2. Click "New Blog Post"
3. Fill in the form:
   - **Title**: Your blog post title
   - **Date**: Publication date
   - **Author**: Your name (defaults to your background info name)
   - **Short Description**: Brief summary shown in post listings
   - **Content**: Full blog post content (supports Markdown syntax)
4. Click "Save Post"

**Editing a Blog Post:**
- Click the edit icon (pencil) on any blog post card
- Modify the content and save

**Deleting a Blog Post:**
- Click the delete icon (trash) on any blog post card
- Confirm the deletion

**Markdown Support:**
You can use Markdown syntax in your blog post content:
- Headers: `# H1`, `## H2`, `### H3`
- Bold: `**text**`
- Italic: `*text*`
- Code blocks: ` ```code``` `
- Links: `[text](url)`
- Lists: `- item` or `1. item`
- And more!

### Portfolio Management

**Adding a Portfolio Item:**
1. Go to the "Portfolio" tab
2. Click "New Portfolio Item"
3. Fill in the form:
   - **Title**: Project name
   - **Description**: Brief project description
   - **Icon Class**: Font Awesome icon class (e.g., `fas fa-brain`, `fas fa-code`)
   - **Link URL**: Optional project link
4. Click "Save Item"

**Editing/Deleting:**
- Use the edit/delete buttons on portfolio item cards

**Icon Classes:**
Common Font Awesome icons:
- `fas fa-brain` - AI/ML projects
- `fas fa-code` - Software projects
- `fas fa-chart-line` - Data projects
- `fas fa-mobile-alt` - Mobile apps
- `fas fa-globe` - Web projects
- Browse more at: https://fontawesome.com/icons

### Background Information

**Editing Your Info:**
1. Go to the "Background Info" tab
2. Edit any fields:
   - **Name**: Your full name (shown in header)
   - **Subtitle**: Your title/tagline (shown under name)
   - **Hero Title**: Main heading on homepage
   - **Hero Description**: Subheading on homepage
   - **About Me**: Your bio/about section
   - **GitHub/LinkedIn/Email**: Social links
3. Click "Save Background Info"

## Data Storage & Backup

### Primary Storage: LocalStorage
All content is stored in your browser's LocalStorage. This means:
- ✅ No backend required
- ✅ Works offline
- ✅ Instant updates
- ⚠️ Data is stored locally in your browser
- ⚠️ If you clear browser data, your content will be reset

### Backup & Restore (Important!)

**To prevent data loss, use the backup feature:**

1. **Download Backup:**
   - Click "Download Backup" button in the admin dashboard
   - This saves all your data as a JSON file
   - File name includes the date: `website-backup-2024-01-15.json`

2. **Google Drive Backup (Recommended):**
   - Download your backup file
   - Go to [drive.google.com](https://drive.google.com)
   - Upload the JSON file to your Google Drive
   - Create a "Website Backups" folder to organize
   - This ensures your data is safe in the cloud!

3. **Restore from Backup:**
   - Click "Upload & Restore" button
   - Select your backup JSON file
   - Confirm to restore your data
   - Page will refresh automatically

**Best Practices:**
- ✓ Backup regularly (weekly or after major changes)
- ✓ Keep multiple backup copies
- ✓ Store backups in Google Drive for cloud safety
- ✓ Backup before clearing browser data or switching browsers

## Important Notes

1. **LocalStorage Limitations**: Data is stored in your browser. If you switch browsers or clear cache, you'll need to restore from backup.

2. **Backup Regularly**: Use the backup feature frequently to prevent data loss.

3. **Mobile Friendly**: The admin dashboard is fully responsive and works on mobile devices.

4. **Data Location**: All content (blog posts, portfolio, background info) is included in one backup file.

## Troubleshooting

**Content not showing:**
- Make sure JavaScript is enabled
- Check browser console for errors
- Ensure DataManager is initialized (should happen automatically)

**Changes not appearing:**
- Refresh the page
- Clear browser cache and reload
- Check that data is saved in LocalStorage (browser DevTools > Application > Local Storage)

**Need to reset:**
- Clear browser LocalStorage
- Or manually reset using browser DevTools

## Disabling Admin for Public Website

**⚠️ IMPORTANT:** Before publishing your website, you MUST disable the admin panel!

### Quick Disable Method

1. Open `assets/js/admin-config.js`
2. Change `ADMIN_ENABLED: true` to `ADMIN_ENABLED: false`
3. Save the file

This will:
- ✅ Hide all admin links from navigation
- ✅ Block access to the admin page
- ✅ Prevent unauthorized editing

### Password Protection (Alternative)

If you want to keep admin access for yourself:

1. Set `ADMIN_ENABLED: true`
2. Set `ADMIN_PASSWORD: 'your-password-here'`
3. Admin links will be hidden, but you can access admin with the password

**See `PUBLISH_GUIDE.md` for detailed instructions.**

## Next Steps

1. Start by editing your Background Information
2. Add your portfolio projects
3. Create your first blog post
4. Visit the main site to see your changes!
5. **Before publishing:** Disable admin in `assets/js/admin-config.js`

---

Happy editing! 🎉

