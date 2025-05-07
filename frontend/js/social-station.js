/**
 * Social Station Integration
 * Handles integration with Mixpost for social media management
 */
document.addEventListener('DOMContentLoaded', () => {
  const socialStationBtn = document.querySelector('.nav-button[data-feature="social-station"]');
  const mainContent = document.querySelector('.main-content');
  const socialStationContainer = document.getElementById('social-station-container');
  
  if (socialStationBtn && mainContent) {
    socialStationBtn.addEventListener('click', () => {
      document.querySelectorAll('.feature-container').forEach(container => {
        container.classList.add('hidden');
      });
      
      if (socialStationContainer) {
        socialStationContainer.classList.remove('hidden');
      } else {
        createSocialStationContainer();
      }
      
      document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
      });
      socialStationBtn.classList.add('active');
    });
  }
  
  /**
   * Create Social Station container and append to main content
   */
  function createSocialStationContainer() {
    const container = document.createElement('div');
    container.id = 'social-station-container';
    container.className = 'feature-container social-station-container';
    
    container.innerHTML = `
      <div class="social-station-header">
        <div class="social-station-title">Social Station</div>
        <div class="social-station-actions">
          <button id="refresh-mixpost" class="btn btn-sm">
            <i class="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
          <button id="fullscreen-mixpost" class="btn btn-sm">
            <i class="fas fa-expand"></i>
            <span>Fullscreen</span>
          </button>
        </div>
      </div>
      
      <div class="social-station-content">
        <iframe 
          id="mixpost-iframe" 
          class="mixpost-iframe" 
          src="/social-station/mixpost"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads allow-modals allow-top-navigation"
          allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
        ></iframe>
        
        <div id="mixpost-loading" class="mixpost-loading">
          <div class="mixpost-spinner"></div>
          <div class="mixpost-loading-text">Loading Mixpost...</div>
        </div>
        
        <div id="mixpost-setup-required" class="mixpost-setup-required hidden">
          <div class="setup-message">
            <i class="fas fa-server"></i>
            <h3>Mixpost Setup Required</h3>
            <p>Mixpost needs to be set up before you can use it. Run the setup script to get started:</p>
            <pre>cd ~/repos/google-gemini-live-api-multimodal-demo && ./scripts/setup-mixpost.sh</pre>
            <button id="retry-mixpost" class="btn btn-primary">Retry Connection</button>
          </div>
        </div>
      </div>
    `;
    
    mainContent.appendChild(container);
    
    initMixpost();
    
    const refreshBtn = document.getElementById('refresh-mixpost');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        const iframe = document.getElementById('mixpost-iframe');
        if (iframe) {
          iframe.src = iframe.src;
        }
      });
    }
    
    const fullscreenBtn = document.getElementById('fullscreen-mixpost');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const iframe = document.getElementById('mixpost-iframe');
        if (iframe) {
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
          } else if (iframe.mozRequestFullScreen) {
            iframe.mozRequestFullScreen();
          } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
          } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
          }
        }
      });
    }
    
    const retryBtn = document.getElementById('retry-mixpost');
    if (retryBtn) {
      retryBtn.addEventListener('click', initMixpost);
    }
  }
  
  /**
   * Initialize Mixpost iframe and handle loading states
   */
  function initMixpost() {
    const iframe = document.getElementById('mixpost-iframe');
    const loading = document.getElementById('mixpost-loading');
    const setupRequired = document.getElementById('mixpost-setup-required');
    
    if (iframe && loading) {
      loading.classList.remove('hidden');
      setupRequired.classList.add('hidden');
      
      iframe.onload = () => {
        loading.classList.add('hidden');
        
        try {
          setTimeout(() => {
            try {
              const iframeContent = iframe.contentWindow.document.body.innerHTML;
              if (iframeContent.includes('Error connecting to Mixpost') || 
                  iframeContent.includes('404 Not Found') ||
                  iframeContent.includes('500 Internal Server Error')) {
                setupRequired.classList.remove('hidden');
                iframe.classList.add('hidden');
              } else {
                iframe.classList.remove('hidden');
              }
            } catch (e) {
              iframe.classList.remove('hidden');
            }
          }, 1000);
        } catch (e) {
          iframe.classList.remove('hidden');
        }
      };
      
      iframe.onerror = () => {
        loading.classList.add('hidden');
        setupRequired.classList.remove('hidden');
        iframe.classList.add('hidden');
      };
    }
  }
});
