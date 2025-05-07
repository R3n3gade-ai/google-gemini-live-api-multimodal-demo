/**
 * Social Station Integration
 * Handles integration with Mixpost for social media management
 */
document.addEventListener('DOMContentLoaded', () => {
  const socialStationBtn = document.querySelector('.nav-button[data-feature="social-station"]');
  const mainContent = document.querySelector('.main-content');
  const socialStationContainer = document.getElementById('social-station-container');
  const socialStationIframe = document.getElementById('social-station-iframe');
  const socialStationLoading = document.getElementById('social-station-loading');
  const socialStationTabs = document.querySelectorAll('.social-station-tab');
  const socialStationPanels = document.querySelectorAll('.social-station-panel');
  
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
  
  if (socialStationTabs) {
    socialStationTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        socialStationTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        socialStationPanels.forEach(panel => {
          panel.classList.remove('active');
          if (panel.id === `${tabId}-panel`) {
            panel.classList.add('active');
          }
        });
        
        if (tabId === 'mixpost' && socialStationIframe) {
          loadMixpost();
        }
      });
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
          <button class="btn btn-sm">
            <i class="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <div class="social-station-tabs">
        <div class="social-station-tab active" data-tab="mixpost">Mixpost</div>
        <div class="social-station-tab" data-tab="analytics">Analytics</div>
        <div class="social-station-tab" data-tab="accounts">Accounts</div>
      </div>
      
      <div class="social-station-content">
        <div id="mixpost-panel" class="social-station-panel active">
          <iframe 
            id="social-station-iframe" 
            class="social-station-iframe" 
            src="about:blank"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="camera; microphone; fullscreen"
          ></iframe>
          
          <div id="social-station-loading" class="social-station-loading">
            <div class="social-station-spinner"></div>
            <div class="social-station-loading-text">Loading Mixpost...</div>
          </div>
        </div>
        
        <div id="analytics-panel" class="social-station-panel">
          <div class="panel-placeholder">
            <i class="fas fa-chart-line"></i>
            <span>Analytics Dashboard Coming Soon</span>
          </div>
        </div>
        
        <div id="accounts-panel" class="social-station-panel">
          <div class="panel-placeholder">
            <i class="fas fa-users-cog"></i>
            <span>Account Management Coming Soon</span>
          </div>
        </div>
      </div>
    `;
    
    mainContent.appendChild(container);
    
    const iframe = document.getElementById('social-station-iframe');
    const loading = document.getElementById('social-station-loading');
    const tabs = container.querySelectorAll('.social-station-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const panels = container.querySelectorAll('.social-station-panel');
        panels.forEach(panel => {
          panel.classList.remove('active');
          if (panel.id === `${tabId}-panel`) {
            panel.classList.add('active');
          }
        });
        
        if (tabId === 'mixpost' && iframe) {
          loadMixpost();
        }
      });
    });
    
    if (iframe && loading) {
      loadMixpost();
    }
  }
  
  /**
   * Load Mixpost in iframe
   */
  function loadMixpost() {
    const iframe = document.getElementById('social-station-iframe');
    const loading = document.getElementById('social-station-loading');
    
    if (iframe && loading) {
      loading.classList.remove('hidden');
      
      iframe.src = '/social-station/mixpost';
      
      iframe.onload = () => {
        loading.classList.add('hidden');
      };
      
      iframe.onerror = () => {
        loading.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span>Failed to load Mixpost. Please try again.</span>
            <button class="btn btn-sm btn-retry">Retry</button>
          </div>
        `;
        
        const retryBtn = loading.querySelector('.btn-retry');
        if (retryBtn) {
          retryBtn.addEventListener('click', loadMixpost);
        }
      };
    }
  }
});
