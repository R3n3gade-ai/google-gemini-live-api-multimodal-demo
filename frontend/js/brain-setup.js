document.addEventListener('DOMContentLoaded', () => {
  const brainButton = document.querySelector('.nav-button[data-feature="brain-setup"]');
  const mainContent = document.querySelector('.main-content');
  
  let currentStep = 1;
  const brainData = {
    identity: {
      name: '',
      description: '',
      email: ''
    },
    memories: [],
    training: {
      synthesisMode: 'medium',
      baseModel: 'Qwen2-0.5B-Instruct',
      learningRate: 0.0001,
      epochs: 3,
      threads: 2,
      enableGPU: false,
      thinkingModel: false
    }
  };
  
  const initBrainSetup = () => {
    brainButton.addEventListener('click', openBrainSetup);
    
    createBrainContainer();
    
    fetchExistingBrains();
  };
  
  const openBrainSetup = () => {
    createBrainSetupContainer();
  };
  
  const closeBrainSetup = () => {
    const container = document.getElementById('brainSetupContainer');
    if (container) {
      container.classList.remove('active');
      setTimeout(() => {
        container.remove();
      }, 300);
    }
  };
  
  const createBrainContainer = () => {
    if (document.getElementById('brainContainer')) {
      return;
    }
    
    const container = document.createElement('div');
    container.id = 'brainContainer';
    container.className = 'brain-container';
    
    const header = document.createElement('div');
    header.className = 'brain-container-header';
    
    const title = document.createElement('div');
    title.className = 'brain-container-title';
    title.textContent = 'Your Brains';
    
    const actions = document.createElement('div');
    actions.className = 'brain-container-actions';
    
    const refreshButton = document.createElement('button');
    refreshButton.className = 'brain-container-action';
    refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshButton.addEventListener('click', fetchExistingBrains);
    
    actions.appendChild(refreshButton);
    header.appendChild(title);
    header.appendChild(actions);
    
    const brainList = document.createElement('div');
    brainList.id = 'brainList';
    brainList.className = 'brain-list';
    
    container.appendChild(header);
    container.appendChild(brainList);
    
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.parentNode.insertBefore(container, chatContainer.nextSibling);
    }
  };
  
  initBrainSetup();
});
