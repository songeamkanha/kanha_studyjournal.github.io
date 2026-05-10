// Data Manager - Handles LocalStorage operations for blog posts, portfolio, and background info

const DataManager = {
  // Storage keys
  STORAGE_KEYS: {
    BLOG_POSTS: 'blog_posts',
    PORTFOLIO: 'portfolio_items',
    BACKGROUND: 'background_info'
  },

  // Initialize default data if not exists
  init() {
    if (this._initialized) return;   // guard: prevent double-init
    this._initialized = true;        // mark as initialized
    // Initialize blog posts
    if (!this.getBlogPosts().length) {
      // Load from existing sample post if available
      const defaultPosts = [];
      localStorage.setItem(this.STORAGE_KEYS.BLOG_POSTS, JSON.stringify(defaultPosts));
    }

    // Initialize portfolio
    if (!this.getPortfolio().length) {
      const defaultPortfolio = [];
      localStorage.setItem(this.STORAGE_KEYS.PORTFOLIO, JSON.stringify(defaultPortfolio));
    }

    // Initialize background info
    if (!this.getBackgroundInfo()) {
      const defaultBackground = {
        name: 'Songeam Kanha',
        subtitle: 'AI/ML Engineer & Developer',
        heroTitle: "Hello, I'm Kanha",
        heroText: 'Passionate about AI, Machine Learning, and Software Development',
        about: 'I am a data scientist with a passion for machine learning and AI. This website showcases my work and projects.',
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        email: 'your.email@example.com'
      };
      localStorage.setItem(this.STORAGE_KEYS.BACKGROUND, JSON.stringify(defaultBackground));
    }
  },

  // Blog Posts
  getBlogPosts() {
    try {
      const posts = localStorage.getItem(this.STORAGE_KEYS.BLOG_POSTS);
      return posts ? JSON.parse(posts) : [];
    } catch (e) {
      console.error('Error loading blog posts:', e);
      return [];
    }
  },

  saveBlogPost(post) {
    const posts = this.getBlogPosts();
    if (post.id) {
      // Update existing
      const index = posts.findIndex(p => p.id === post.id);
      if (index !== -1) {
        posts[index] = post;
      }
    } else {
      // Create new
      post.id = Date.now().toString();
      post.createdAt = new Date().toISOString();
      posts.push(post);
    }
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem(this.STORAGE_KEYS.BLOG_POSTS, JSON.stringify(posts));
    return post;
  },

  deleteBlogPost(id) {
    const posts = this.getBlogPosts().filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.BLOG_POSTS, JSON.stringify(posts));
  },

  getBlogPost(id) {
    return this.getBlogPosts().find(p => p.id === id);
  },

  // Portfolio
  getPortfolio() {
    try {
      const portfolio = localStorage.getItem(this.STORAGE_KEYS.PORTFOLIO);
      return portfolio ? JSON.parse(portfolio) : [];
    } catch (e) {
      console.error('Error loading portfolio:', e);
      return [];
    }
  },

  savePortfolioItem(item) {
    const portfolio = this.getPortfolio();
    if (item.id) {
      // Update existing
      const index = portfolio.findIndex(p => p.id === item.id);
      if (index !== -1) {
        portfolio[index] = item;
      }
    } else {
      // Create new
      item.id = Date.now().toString();
      portfolio.push(item);
    }
    localStorage.setItem(this.STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    return item;
  },

  deletePortfolioItem(id) {
    const portfolio = this.getPortfolio().filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
  },

  getPortfolioItem(id) {
    return this.getPortfolio().find(p => p.id === id);
  },

  // Background Info
  getBackgroundInfo() {
    try {
      const info = localStorage.getItem(this.STORAGE_KEYS.BACKGROUND);
      return info ? JSON.parse(info) : null;
    } catch (e) {
      console.error('Error loading background info:', e);
      return null;
    }
  },

  saveBackgroundInfo(info) {
    localStorage.setItem(this.STORAGE_KEYS.BACKGROUND, JSON.stringify(info));
    return info;
  },

  // Export/Import data
  exportData() {
    return {
      blogPosts: this.getBlogPosts(),
      portfolio: this.getPortfolio(),
      background: this.getBackgroundInfo(),
      exportedAt: new Date().toISOString()
    };
  },

  importData(data) {
    if (data.blogPosts) {
      localStorage.setItem(this.STORAGE_KEYS.BLOG_POSTS, JSON.stringify(data.blogPosts));
    }
    if (data.portfolio) {
      localStorage.setItem(this.STORAGE_KEYS.PORTFOLIO, JSON.stringify(data.portfolio));
    }
    if (data.background) {
      localStorage.setItem(this.STORAGE_KEYS.BACKGROUND, JSON.stringify(data.background));
    }
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  DataManager.init();
}

