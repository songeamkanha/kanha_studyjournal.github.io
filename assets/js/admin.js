// Admin Dashboard JavaScript

// Tab switching
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  loadBlogPosts();
  loadPortfolio();
  loadBackgroundInfo();
  setupForms();
});

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Remove active class from all
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to selected
      btn.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
}

// Blog Posts Management
function loadBlogPosts() {
  const posts = DataManager.getBlogPosts();
  const listEl = document.getElementById('blog-posts-list');

  if (posts.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-blog"></i>
        <h3>No blog posts yet</h3>
        <p>Click "New Blog Post" to create your first post</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = posts.map(post => `
    <div class="item-card">
      <div class="item-card-content">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.description || '')}</p>
        <div class="item-card-meta">
          <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
          <span style="margin-left: 1rem;"><i class="fas fa-user"></i> ${escapeHtml(post.author || '')}</span>
        </div>
      </div>
      <div class="item-card-actions">
        <button class="btn-icon" onclick="editBlogPost('${post.id}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete" onclick="deleteBlogPost('${post.id}')" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openBlogEditor(postId = null) {
  const modal = document.getElementById('blog-editor-modal');
  const form = document.getElementById('blog-editor-form');
  const titleEl = document.getElementById('blog-editor-title');

  if (postId) {
    const post = DataManager.getBlogPost(postId);
    if (post) {
      titleEl.textContent = 'Edit Blog Post';
      document.getElementById('blog-post-id').value = post.id;
      document.getElementById('blog-title').value = post.title || '';
      document.getElementById('blog-date').value = post.date || '';
      document.getElementById('blog-author').value = post.author || '';
      document.getElementById('blog-description').value = post.description || '';
      document.getElementById('blog-content').value = post.content || '';
    }
  } else {
    titleEl.textContent = 'New Blog Post';
    form.reset();
    document.getElementById('blog-post-id').value = '';
    // Set default date to today
    document.getElementById('blog-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('blog-author').value = DataManager.getBackgroundInfo()?.name || '';
  }

  modal.classList.add('active');
}

function closeBlogEditor() {
  document.getElementById('blog-editor-modal').classList.remove('active');
  document.getElementById('blog-editor-form').reset();
}

function editBlogPost(id) {
  openBlogEditor(id);
}

function deleteBlogPost(id) {
  if (confirm('Are you sure you want to delete this blog post?')) {
    DataManager.deleteBlogPost(id);
    loadBlogPosts();
    showSuccessMessage('Blog post deleted successfully!');
  }
}

// Portfolio Management
function loadPortfolio() {
  const portfolio = DataManager.getPortfolio();
  const listEl = document.getElementById('portfolio-items-list');

  if (portfolio.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-briefcase"></i>
        <h3>No portfolio items yet</h3>
        <p>Click "New Portfolio Item" to add your first project</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = portfolio.map(item => `
    <div class="item-card">
      <div class="item-card-content">
        <h3><i class="${escapeHtml(item.icon || 'fas fa-code')}"></i> ${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description || '')}</p>
        ${item.link ? `<div class="item-card-meta"><i class="fas fa-link"></i> ${escapeHtml(item.link)}</div>` : ''}
      </div>
      <div class="item-card-actions">
        <button class="btn-icon" onclick="editPortfolioItem('${item.id}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete" onclick="deletePortfolioItem('${item.id}')" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function openPortfolioEditor(itemId = null) {
  const modal = document.getElementById('portfolio-editor-modal');
  const form = document.getElementById('portfolio-editor-form');
  const titleEl = document.getElementById('portfolio-editor-title');

  if (itemId) {
    const item = DataManager.getPortfolioItem(itemId);
    if (item) {
      titleEl.textContent = 'Edit Portfolio Item';
      document.getElementById('portfolio-item-id').value = item.id;
      document.getElementById('portfolio-title').value = item.title || '';
      document.getElementById('portfolio-description').value = item.description || '';
      document.getElementById('portfolio-icon').value = item.icon || '';
      document.getElementById('portfolio-link').value = item.link || '';
    }
  } else {
    titleEl.textContent = 'New Portfolio Item';
    form.reset();
    document.getElementById('portfolio-item-id').value = '';
  }

  modal.classList.add('active');
}

function closePortfolioEditor() {
  document.getElementById('portfolio-editor-modal').classList.remove('active');
  document.getElementById('portfolio-editor-form').reset();
}

function editPortfolioItem(id) {
  openPortfolioEditor(id);
}

function deletePortfolioItem(id) {
  if (confirm('Are you sure you want to delete this portfolio item?')) {
    DataManager.deletePortfolioItem(id);
    loadPortfolio();
    showSuccessMessage('Portfolio item deleted successfully!');
  }
}

// Background Info
function loadBackgroundInfo() {
  const info = DataManager.getBackgroundInfo();
  if (!info) return;

  document.getElementById('background-name').value = info.name || '';
  document.getElementById('background-subtitle').value = info.subtitle || '';
  document.getElementById('background-hero-title').value = info.heroTitle || '';
  document.getElementById('background-hero-text').value = info.heroText || '';
  document.getElementById('background-about').value = info.about || '';
  document.getElementById('background-github').value = info.github || '';
  document.getElementById('background-linkedin').value = info.linkedin || '';
  document.getElementById('background-email').value = info.email || '';
}

// Form handlers
function setupForms() {
  // Blog post form
  document.getElementById('blog-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const post = {
      id: formData.get('id') || null,
      title: formData.get('title'),
      date: formData.get('date'),
      author: formData.get('author'),
      description: formData.get('description'),
      content: formData.get('content')
    };

    DataManager.saveBlogPost(post);
    loadBlogPosts();
    closeBlogEditor();
    showSuccessMessage('Blog post saved successfully!');
  });

  // Portfolio form
  document.getElementById('portfolio-editor-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = {
      id: formData.get('id') || null,
      title: formData.get('title'),
      description: formData.get('description'),
      icon: formData.get('icon'),
      link: formData.get('link') || null
    };

    DataManager.savePortfolioItem(item);
    loadPortfolio();
    closePortfolioEditor();
    showSuccessMessage('Portfolio item saved successfully!');
  });

  // Background info form
  document.getElementById('background-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const info = {
      name: formData.get('name'),
      subtitle: formData.get('subtitle'),
      heroTitle: formData.get('heroTitle'),
      heroText: formData.get('heroText'),
      about: formData.get('about'),
      github: formData.get('github') || '',
      linkedin: formData.get('linkedin') || '',
      email: formData.get('email') || ''
    };

    DataManager.saveBackgroundInfo(info);
    showSuccessMessage('Background information saved successfully!');
  });
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showSuccessMessage(message) {
  // Remove existing message
  const existing = document.querySelector('.success-message');
  if (existing) existing.remove();

  // Create new message
  const msg = document.createElement('div');
  msg.className = 'success-message';
  msg.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

  // Insert at top of active tab content
  const activeTab = document.querySelector('.tab-content.active');
  activeTab.insertBefore(msg, activeTab.firstChild);

  // Auto remove after 3 seconds
  setTimeout(() => msg.remove(), 3000);
}

// Close modal on outside click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

