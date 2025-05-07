/**
 * Content Manager
 * Handles loading and displaying content in the main area
 */

class ContentManager {
  constructor() {
    this.mainContent = document.querySelector('.main-card .card-body');
    
    this.originalContent = this.mainContent.innerHTML;
    
    this.currentPage = 'chat';
    this.currentFeature = 'feature-home';
    
    this.initEventListeners();
  }
  
  /**
   * Initialize event listeners for navigation buttons
   */
  initEventListeners() {
    // Use event delegation for all navigation buttons
    document.addEventListener('click', (event) => {
      // Main navigation buttons
      const navButton = event.target.closest('.nav-button');
      if (navButton) {
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
        return;
      }
      
      // Feature navigation buttons
      const featureNavButton = event.target.closest('.feature-nav-button');
      if (featureNavButton) {
        const featureId = featureNavButton.getAttribute('data-feature');
        if (featureId) {
          this.showFeature(featureId);
        }
        return;
      }
      
      // Feature content cards
      const contentCard = event.target.closest('.content-card');
      if (contentCard) {
        const featureId = contentCard.getAttribute('data-feature');
        if (featureId) {
          this.showFeature(featureId);
        }
        return;
      }
      
      const loadEditorButton = event.target.closest('#load-video-editor');
      if (loadEditorButton) {
        this.loadVideoEditor();
        return;
      }
    });
  }
  
  /**
   * Show a specific feature in the Creation Studio
   * @param {string} featureId - ID of the feature to show
   */
  showFeature(featureId) {
    if (this.currentFeature === featureId) return;
    
    this.currentFeature = featureId;
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.feature-nav-button');
    navButtons.forEach(button => {
      if (button.getAttribute('data-feature') === featureId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    const featurePanels = document.querySelectorAll('.feature-panel');
    featurePanels.forEach(panel => {
      if (panel.id === featureId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
    
    if (featureId === 'video-editor') {
      this.loadVideoEditor();
    }
  }
  
  /**
   * Load the video editor in an iframe
   */
  loadVideoEditor() {
    const iframe = document.getElementById('video-editor-iframe');
    const placeholder = document.querySelector('.video-editor-placeholder');
    
    if (iframe && placeholder) {
      placeholder.style.display = 'flex';
      placeholder.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>Loading Video Editor...</p></div>';
      
      const isTunnel = window.location.hostname.includes('devinapps.com');
      let editorUrl;
      
      if (isTunnel) {
        editorUrl = 'https://user:6dae2dcca92c1035914d385d5778dd3f@google-gemini-demo-tunnel-pd6hn0r2.devinapps.com';
      } else {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        editorUrl = `${protocol}//${hostname}:3000`;
      }
      
      if (!iframe.src) {
        iframe.src = editorUrl;
      }
      
      iframe.onload = () => {
        placeholder.style.display = 'none';
      };
      
      iframe.onerror = () => {
        placeholder.style.display = 'flex';
        placeholder.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load Video Editor. Please try again later.</p>
            <button id="retry-load-editor" class="load-feature-button">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
        `;
        
        const retryButton = document.getElementById('retry-load-editor');
        if (retryButton) {
          retryButton.addEventListener('click', () => this.loadVideoEditor());
        }
      };
    }
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
        
        <div class="creation-studio-container">
          <!-- Feature Navigation -->
          <div class="feature-nav">
            <button class="feature-nav-button active" data-feature="feature-home">
              <i class="fas fa-home"></i> Home
            </button>
            <button class="feature-nav-button" data-feature="image-generation">
              <i class="fas fa-image"></i> Image Generation
            </button>
            <button class="feature-nav-button" data-feature="video-creation">
              <i class="fas fa-video"></i> Video Creation
            </button>
            <button class="feature-nav-button" data-feature="video-editor">
              <i class="fas fa-film"></i> Video Editor
            </button>
            <button class="feature-nav-button" data-feature="audio-production">
              <i class="fas fa-music"></i> Audio Production
            </button>
          </div>
          
          <!-- Feature Content Container -->
          <div class="feature-content">
            <!-- Home View (Feature Cards) -->
            <div class="feature-panel active" id="feature-home">
              <div class="content-grid">
                <div class="content-card" data-feature="image-generation">
                  <div class="card-icon"><i class="fas fa-image"></i></div>
                  <h3>Image Generation</h3>
                  <p>Create stunning images with AI</p>
                </div>
                
                <div class="content-card" data-feature="video-creation">
                  <div class="card-icon"><i class="fas fa-video"></i></div>
                  <h3>Video Creation</h3>
                  <p>Generate videos from text prompts</p>
                </div>
                
                <div class="content-card" data-feature="video-editor">
                  <div class="card-icon"><i class="fas fa-film"></i></div>
                  <h3>Video Editor</h3>
                  <p>Edit and enhance your videos</p>
                </div>
                
                <div class="content-card" data-feature="audio-production">
                  <div class="card-icon"><i class="fas fa-music"></i></div>
                  <h3>Audio Production</h3>
                  <p>Create music and sound effects</p>
                </div>
              </div>
            </div>
            
            <!-- Image Generation Feature Panel -->
            <div class="feature-panel" id="image-generation">
              <h3 class="feature-title">Image Generation</h3>
              <p class="feature-description">Create stunning images with AI</p>
              <div class="feature-content-placeholder">
                <p>Image generation feature will be implemented here.</p>
              </div>
            </div>
            
            <!-- Video Creation Feature Panel -->
            <div class="feature-panel" id="video-creation">
              <h3 class="feature-title">Video Creation</h3>
              <p class="feature-description">Generate videos from text prompts</p>
              <div class="feature-content-placeholder">
                <p>Video creation feature will be implemented here.</p>
              </div>
            </div>
            
            <!-- Video Editor Feature Panel -->
            <div class="feature-panel" id="video-editor">
              <h3 class="feature-title">Video Editor</h3>
              <p class="feature-description">Edit and enhance your videos</p>
              <div class="video-editor-container">
                <iframe id="video-editor-iframe" frameborder="0" allowfullscreen></iframe>
                <div class="video-editor-placeholder" style="display: none;">
                  <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i> 
                    <p>Loading Video Editor...</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Audio Production Feature Panel -->
            <div class="feature-panel" id="audio-production">
              <h3 class="feature-title">Audio Production</h3>
              <p class="feature-description">Create music and sound effects</p>
              <div class="feature-content-placeholder">
                <p>Audio production feature will be implemented here.</p>
              </div>
            </div>
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
