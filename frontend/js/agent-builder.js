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
            <iframe id="agent-builder-iframe" frameborder="0"></iframe>
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
    const placeholder = document.querySelector('.agent-builder-placeholder');
    const wrapper = document.querySelector('.agent-builder-wrapper');
    
    const iframe = document.createElement('iframe');
    iframe.id = 'agent-builder-iframe';
    iframe.src = 'https://user:5601d5feaae9622152e6a5da2f4ba473@google-gemini-demo-tunnel-0hdiersd.devinapps.com';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    
    wrapper.innerHTML = '';
    wrapper.appendChild(iframe);
    
    iframe.addEventListener('load', () => {
      console.log('Agent Builder iframe loaded');
      sendApiKeyToAgentBuilder();
    });
    
    iframe.addEventListener('error', () => {
      console.error('Failed to load Agent Builder iframe');
      wrapper.innerHTML = `
        <div class="agent-builder-direct-link">
          <h3>Agent Builder is ready!</h3>
          <p>Click the button below to open the Agent Builder in a new tab:</p>
          <a href="https://user:5601d5feaae9622152e6a5da2f4ba473@google-gemini-demo-tunnel-0hdiersd.devinapps.com" 
             target="_blank" 
             class="agent-builder-link-button">
            <i class="fas fa-external-link-alt"></i>
            Open Agent Builder
          </a>
          <p class="agent-builder-note">Note: The Agent Builder will open in a new tab. You can return to this tab to continue using the AI Workstation.</p>
        </div>
      `;
    });
    
    placeholder.classList.add('hidden');
    wrapper.classList.remove('hidden');
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
