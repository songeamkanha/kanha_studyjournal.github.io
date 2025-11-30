// Admin Link Handler - Hides/shows admin links based on configuration

document.addEventListener('DOMContentLoaded', () => {
  // Wait for AdminConfig to be available
  if (typeof AdminConfig !== 'undefined') {
    // Hide admin links if admin is disabled
    if (!AdminConfig.shouldShowAdminLink()) {
      // Find all admin links and hide them
      const adminLinks = document.querySelectorAll('a[href*="admin"]');
      adminLinks.forEach(link => {
        // Check if this is actually an admin link
        if (link.href && link.href.includes('admin')) {
          link.style.display = 'none';
        }
      });
    }
  } else {
    // If AdminConfig not loaded, hide admin links by default for safety
    // This prevents admin links from showing if config fails to load
    const adminLinks = document.querySelectorAll('a[href*="admin"]');
    adminLinks.forEach(link => {
      if (link.href && link.href.includes('admin') && !link.href.includes('view')) {
        link.style.display = 'none';
      }
    });
  }
});

