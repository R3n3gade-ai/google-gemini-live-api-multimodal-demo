/**
 * Agent Builder Integration
 * Handles the integration with the containerized google-adk-nocode application
 */
document.addEventListener('DOMContentLoaded', () => {
  const agentBuilderBtn = document.querySelector('.nav-button[data-feature="agent-builder"]');
  const mainContent = document.querySelector('.main-content');
  const mainCard = document.querySelector('.main-card');
  let agentBuilderContainer = null;
  
  if (agentBuilderBtn) {
    agentBuilderBtn.addEventListener('click', toggleAgentBuilder);
  }
  
  /**
   * Toggle Agent Builder visibility
   */
  function toggleAgentBuilder() {
    if (!agentBuilderContainer) {
      createAgentBuilderContainer();
    }
    
    const isVisible = !agentBuilderContainer.classList.contains('hidden');
    
    if (isVisible) {
      agentBuilderContainer.classList.add('hidden');
      mainCard.classList.remove('hidden');
    } else {
      mainCard.classList.add('hidden');
      agentBuilderContainer.classList.remove('hidden');
      
      const iframe = agentBuilderContainer.querySelector('#agent-builder-iframe');
      if (iframe && !iframe.src) {
        loadAgentBuilder();
      }
    }
  }
  
  /**
   * Create Agent Builder container
   */
  function createAgentBuilderContainer() {
    agentBuilderContainer = document.createElement('div');
    agentBuilderContainer.className = 'agent-builder-container hidden';
    agentBuilderContainer.innerHTML = `
      <div class="feature-nav">
        <button class="feature-nav-button active">
          <i class="fas fa-robot"></i>
          <span>Agent Builder</span>
        </button>
        <button class="feature-nav-button return-to-chat">
          <i class="fas fa-arrow-left"></i>
          <span>Return to Chat</span>
        </button>
      </div>
      
      <div class="feature-content">
        <div class="feature-panel active">
          <div class="agent-builder-placeholder">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
              <span>Loading Agent Builder...</span>
            </div>
          </div>
          
          <div class="agent-builder-wrapper hidden">
            <iframe id="agent-builder-iframe" src="" frameborder="0"></iframe>
          </div>
        </div>
      </div>
    `;
    
    const returnToChatBtn = agentBuilderContainer.querySelector('.return-to-chat');
    returnToChatBtn.addEventListener('click', toggleAgentBuilder);
    
    mainContent.appendChild(agentBuilderContainer);
  }
  
  /**
   * Load Agent Builder iframe
   */
  function loadAgentBuilder() {
    const iframe = document.getElementById('agent-builder-iframe');
    const placeholder = document.querySelector('.agent-builder-placeholder');
    const wrapper = document.querySelector('.agent-builder-wrapper');
    
    if (iframe) {
      iframe.src = 'https://user:5501d3f6e61b8bce50b9a7c5ecadc8c6@google-gemini-demo-tunnel-elsd9938.devinapps.com';
      
      iframe.addEventListener('load', () => {
        placeholder.classList.add('hidden');
        wrapper.classList.remove('hidden');
        
        setTimeout(() => {
          sendApiKeyToAgentBuilder();
        }, 1000);
      });
      
      iframe.addEventListener('error', () => {
        placeholder.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Failed to load Agent Builder. Please make sure the container is running.</span>
            <button class="load-feature-button" id="retry-agent-builder">
              <i class="fas fa-sync"></i>
              <span>Retry</span>
            </button>
          </div>
        `;
        
        const retryBtn = document.getElementById('retry-agent-builder');
        if (retryBtn) {
          retryBtn.addEventListener('click', loadAgentBuilder);
        }
      });
    }
  }
  
  /**
   * Send Gemini API key to the Agent Builder iframe
   */
  function sendApiKeyToAgentBuilder() {
    const iframe = document.getElementById('agent-builder-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'agent-builder',
        action: 'set-api-key',
        apiKey: window.GEMINI_API_KEY || ''
      }, '*');
    }
  }
  
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'agent-builder') {
      console.log('Received message from agent builder:', event.data);
      
      switch (event.data.action) {
        case 'ready':
          console.log('Agent builder is ready');
          sendApiKeyToAgentBuilder();
          break;
        case 'agent-created':
          console.log('Agent created:', event.data.agent);
          break;
        case 'error':
          console.error('Agent builder error:', event.data.message);
          break;
      }
    }
  });
});
