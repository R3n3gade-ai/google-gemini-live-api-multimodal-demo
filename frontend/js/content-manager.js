/**
 * Content Manager
 * Handles loading and displaying content in the main area
 */

class ContentManager {
  constructor() {
    this.mainContent = document.querySelector('.main-card .card-body');
    
    this.originalContent = this.mainContent.innerHTML;
    
    this.currentPage = 'chat';
    
    this.initEventListeners();
  }
  
  /**
   * Initialize event listeners for navigation buttons
   */
  initEventListeners() {
    // Use event delegation for all navigation buttons
    document.addEventListener('click', (event) => {
      const navButton = event.target.closest('.nav-button');
      if (!navButton) return;
      
      const span = navButton.querySelector('span');
      if (!span) return;
      
      const buttonText = span.textContent.trim();
      
      switch (buttonText) {
        case 'Creation Studio':
          event.preventDefault();
          this.loadContent('creation-studio');
          break;
        case 'App/Web Builder':
          event.preventDefault();
          this.loadContent('app-builder');
          break;
        case 'Social Station':
          event.preventDefault();
          this.loadContent('social-station');
          break;
        case 'Brain':
          event.preventDefault();
          this.loadContent('brain');
          break;
        case 'Chat':
          event.preventDefault();
          this.loadContent('chat');
          break;
      }
    });
  }
  
  /**
   * Load content into the main area
   * @param {string} contentId - ID of the content to load
   */
  loadContent(contentId) {
    if (this.currentPage === contentId) return;
    
    this.currentPage = contentId;
    
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer && !videoContainer.classList.contains('hidden')) {
      videoContainer.classList.add('hidden');
    }
    
    this.mainContent.innerHTML = '';
    
    switch (contentId) {
      case 'chat':
        this.mainContent.innerHTML = this.originalContent;
        break;
      case 'creation-studio':
        this.mainContent.innerHTML = this.getCreationStudioContent();
        break;
      case 'app-builder':
        this.mainContent.innerHTML = this.getAppBuilderContent();
        break;
      case 'social-station':
        this.mainContent.innerHTML = this.getSocialStationContent();
        break;
      case 'brain':
        this.mainContent.innerHTML = this.getBrainContent();
        break;
    }
  }
  
  /**
   * Get Creation Studio content
   * @returns {string} HTML content
   */
  getCreationStudioContent() {
    return `
      <div class="page-content">
        <h2 class="page-title">Creation Studio</h2>
        <p class="page-description">Create and manage your AI-generated content</p>
        
        <div class="content-grid">
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-image"></i></div>
            <h3>Image Generation</h3>
            <p>Create stunning images with AI</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-video"></i></div>
            <h3>Video Creation</h3>
            <p>Generate videos from text prompts</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-music"></i></div>
            <h3>Audio Production</h3>
            <p>Create music and sound effects</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-pen-fancy"></i></div>
            <h3>Text Generation</h3>
            <p>Write articles, stories, and more</p>
          </div>
        </div>
        
        <div class="return-button-container">
          <button class="return-button" onclick="window.contentManager.loadContent('chat')">
            <i class="fas fa-arrow-left"></i> Return to Chat
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Get App Builder content
   * @returns {string} HTML content
   */
  getAppBuilderContent() {
    return `
      <div class="page-content">
        <h2 class="page-title">App/Web Builder</h2>
        <p class="page-description">Build applications and websites with AI assistance</p>
        
        <div class="content-grid">
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-mobile-alt"></i></div>
            <h3>Mobile Apps</h3>
            <p>Create native mobile applications</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-globe"></i></div>
            <h3>Web Applications</h3>
            <p>Build responsive web applications</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-desktop"></i></div>
            <h3>Desktop Software</h3>
            <p>Develop cross-platform desktop apps</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-code"></i></div>
            <h3>Code Generation</h3>
            <p>Generate code for your projects</p>
          </div>
        </div>
        
        <div class="return-button-container">
          <button class="return-button" onclick="window.contentManager.loadContent('chat')">
            <i class="fas fa-arrow-left"></i> Return to Chat
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Get Social Station content
   * @returns {string} HTML content
   */
  getSocialStationContent() {
    return `
      <div class="page-content">
        <h2 class="page-title">Social Station</h2>
        <p class="page-description">Manage your social media presence with AI</p>
        
        <div class="content-grid">
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-calendar-alt"></i></div>
            <h3>Content Calendar</h3>
            <p>Schedule and plan your content</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-chart-line"></i></div>
            <h3>Analytics</h3>
            <p>Track performance and engagement</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-comments"></i></div>
            <h3>Community Management</h3>
            <p>Engage with your audience</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-bullhorn"></i></div>
            <h3>Campaign Creation</h3>
            <p>Create and manage marketing campaigns</p>
          </div>
        </div>
        
        <div class="return-button-container">
          <button class="return-button" onclick="window.contentManager.loadContent('chat')">
            <i class="fas fa-arrow-left"></i> Return to Chat
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Get Brain content
   * @returns {string} HTML content
   */
  getBrainContent() {
    return `
      <div class="page-content">
        <h2 class="page-title">Brain</h2>
        <p class="page-description">Manage your AI's knowledge and capabilities</p>
        
        <div class="content-grid">
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-database"></i></div>
            <h3>Knowledge Base</h3>
            <p>Manage your AI's information sources</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-cogs"></i></div>
            <h3>Skills & Abilities</h3>
            <p>Configure AI capabilities</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-history"></i></div>
            <h3>Memory Management</h3>
            <p>Control what your AI remembers</p>
          </div>
          
          <div class="content-card">
            <div class="card-icon"><i class="fas fa-sliders-h"></i></div>
            <h3>Personality Settings</h3>
            <p>Adjust your AI's tone and behavior</p>
          </div>
        </div>
        
        <div class="return-button-container">
          <button class="return-button" onclick="window.contentManager.loadContent('chat')">
            <i class="fas fa-arrow-left"></i> Return to Chat
          </button>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.contentManager = new ContentManager();
});
