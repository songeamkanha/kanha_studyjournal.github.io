// Content Loader - Loads content from LocalStorage and renders it

const ContentLoader = {
  // Initialize and load all content
  init() {
    this.loadBackgroundInfo();
    this.loadBlogPosts();
    this.loadPortfolio();
  },

  // Load and apply background info to homepage
  loadBackgroundInfo() {
    const info = DataManager.getBackgroundInfo();
    if (!info) return;

    // Update header
    const headerH1 = document.querySelector('header h1');
    if (headerH1 && !headerH1.dataset.initialized) {
      headerH1.textContent = info.name;
      headerH1.dataset.initialized = 'true';
    }

    const subtitle = document.querySelector('.subtitle');
    if (subtitle && !subtitle.dataset.initialized) {
      subtitle.textContent = info.subtitle;
      subtitle.dataset.initialized = 'true';
    }

    // Update hero section on homepage
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle && !heroTitle.dataset.initialized) {
      heroTitle.textContent = info.heroTitle;
      heroTitle.dataset.initialized = 'true';
    }

    const heroText = document.querySelector('.hero .lead');
    if (heroText && !heroText.dataset.initialized) {
      heroText.textContent = info.heroText;
      heroText.dataset.initialized = 'true';
    }

    // Update contact section
    const githubLink = document.querySelector('a[href*="github.com"]');
    if (githubLink && info.github) {
      githubLink.href = info.github;
    }

    const linkedinLink = document.querySelector('a[href*="linkedin.com"]');
    if (linkedinLink && info.linkedin) {
      linkedinLink.href = info.linkedin;
    }

    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink && info.email) {
      emailLink.href = `mailto:${info.email}`;
    }
  },

  // Load blog posts on blog index page
  loadBlogPosts() {
    const blogList = document.getElementById('blog-posts-list');
    if (!blogList) return;

    const posts = DataManager.getBlogPosts();
    
    if (posts.length === 0) {
      blogList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-blog"></i>
          <h3>No blog posts yet</h3>
          <p>Check back soon for new content!</p>
        </div>
      `;
      return;
    }

    blogList.innerHTML = posts.map(post => `
      <a class="card" href="posts/view.html?id=${post.id}">
        <div class="card-content">
          <span class="date">${this.formatDate(post.date)}</span>
          <h3>${this.escapeHtml(post.title)}</h3>
          <p>${this.escapeHtml(post.description || '')}</p>
          <span class="read-more">Read More →</span>
        </div>
      </a>
    `).join('');
  },

  // Load blog posts for homepage
  loadHomepageBlogPosts() {
    const blogList = document.getElementById('homepage-blog-list') || document.querySelector('.latest-blog .card-list');
    if (!blogList) return;

    const posts = DataManager.getBlogPosts().slice(0, 3); // Show latest 3
    
    if (posts.length === 0) {
      blogList.innerHTML = `
        <a class="card" href="blog/index.html">
          <div class="card-content">
            <h3>No blog posts yet</h3>
            <p>Check back soon for new content!</p>
          </div>
        </a>
      `;
      return;
    }

    blogList.innerHTML = posts.map(post => `
      <a class="card" href="blog/posts/view.html?id=${post.id}">
        <div class="card-content">
          <span class="date">${this.formatDate(post.date)}</span>
          <h3>${this.escapeHtml(post.title)}</h3>
          <p>${this.escapeHtml(post.description || '')}</p>
          <span class="read-more">Read More →</span>
        </div>
      </a>
    `).join('');
  },

  // Load portfolio items
  loadPortfolio() {
    const portfolioList = document.getElementById('portfolio-list');
    if (!portfolioList) return;

    const items = DataManager.getPortfolio();
    
    if (items.length === 0) {
      portfolioList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-briefcase"></i>
          <h3>No portfolio items yet</h3>
          <p>Check back soon for new projects!</p>
        </div>
      `;
      return;
    }

    portfolioList.innerHTML = items.map(item => `
      <a class="card" href="${item.link || '#'}" ${item.link ? '' : 'onclick="return false;"'}>
        <div class="card-content">
          <i class="${this.escapeHtml(item.icon || 'fas fa-code')}"></i>
          <h3>${this.escapeHtml(item.title)}</h3>
          <p>${this.escapeHtml(item.description || '')}</p>
        </div>
      </a>
    `).join('');
  },

  // Load portfolio for homepage
  loadHomepagePortfolio() {
    const portfolioList = document.querySelector('.featured-projects .card-list');
    if (!portfolioList || portfolioList.dataset.initialized) return;

    const items = DataManager.getPortfolio().slice(0, 2); // Show first 2
    
    if (items.length === 0) {
      return; // Keep existing placeholder
    }

    portfolioList.innerHTML = items.map(item => `
      <a class="card" href="portfolio/index.html">
        <div class="card-content">
          <i class="${this.escapeHtml(item.icon || 'fas fa-code')}"></i>
          <h3>${this.escapeHtml(item.title)}</h3>
          <p>${this.escapeHtml(item.description || '')}</p>
        </div>
      </a>
    `).join('');
    
    portfolioList.dataset.initialized = 'true';
  },

  // Load single blog post
  loadBlogPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (!postId) return;

    const post = DataManager.getBlogPost(postId);
    if (!post) {
      document.querySelector('main').innerHTML = `
        <article class="blog-post">
          <h1>Post Not Found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <a href="../index.html">← Back to Blog</a>
        </article>
      `;
      return;
    }

    // Update page title
    document.title = `${post.title} | Songeam Kanha's Blog`;

    // Render post
    const postContainer = document.querySelector('.blog-post-content');
    if (postContainer) {
      postContainer.innerHTML = `
        <header>
          <h1>${this.escapeHtml(post.title)}</h1>
          <div class="post-meta">
            <span class="date">${this.formatDate(post.date)}</span>
            <span class="author">By ${this.escapeHtml(post.author || 'Songeam Kanha')}</span>
          </div>
        </header>
        <div class="post-content markdown-content">${post.content}</div>
      `;

      // Process markdown if marked is available
      if (typeof marked !== 'undefined') {
        const markdownEl = postContainer.querySelector('.markdown-content');
        if (markdownEl) {
          const markdown = markdownEl.textContent;
          markdownEl.innerHTML = marked.parse(markdown);
        }
      }
    }
  },

  // Utility functions
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  }
};

// Auto-initialize on page load
if (typeof window !== 'undefined' && typeof DataManager !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ContentLoader.init();
  });
}

