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
  
  const fetchExistingBrains = () => {
    const brainList = document.getElementById('brainList');
    if (!brainList) return;
    
    brainList.innerHTML = '<div class="loading-brains">Loading brains...</div>';
    
    fetchBrainsAPI()
      .then(brains => {
        brainList.innerHTML = '';
        
        if (brains.length === 0) {
          brainList.innerHTML = '<div class="no-brains">No brains found. Create one by clicking the Brain button.</div>';
          return;
        }
        
        brains.forEach(brain => {
          const brainItem = document.createElement('div');
          brainItem.className = 'brain-item';
          
          const brainIcon = document.createElement('div');
          brainIcon.className = 'brain-icon';
          brainIcon.innerHTML = '<i class="fas fa-brain"></i>';
          
          const brainInfo = document.createElement('div');
          brainInfo.className = 'brain-info';
          
          const brainName = document.createElement('div');
          brainName.className = 'brain-name';
          brainName.textContent = brain.name;
          
          const brainDescription = document.createElement('div');
          brainDescription.className = 'brain-description';
          brainDescription.textContent = brain.description;
          
          brainInfo.appendChild(brainName);
          brainInfo.appendChild(brainDescription);
          
          const brainToggle = document.createElement('label');
          brainToggle.className = 'toggle-wrapper brain-toggle';
          
          const toggleInput = document.createElement('input');
          toggleInput.type = 'checkbox';
          toggleInput.className = 'toggle-input';
          toggleInput.checked = brain.active;
          toggleInput.addEventListener('change', (e) => {
            toggleBrainAPI(brain.id, e.target.checked)
              .then(() => {
                console.log(`Brain ${brain.id} toggled to ${e.target.checked ? 'active' : 'inactive'}`);
              });
          });
          
          const toggleDisplay = document.createElement('span');
          toggleDisplay.className = 'toggle-display';
          
          brainToggle.appendChild(toggleInput);
          brainToggle.appendChild(toggleDisplay);
          
          brainItem.appendChild(brainIcon);
          brainItem.appendChild(brainInfo);
          brainItem.appendChild(brainToggle);
          
          brainList.appendChild(brainItem);
        });
      })
      .catch(error => {
        console.error('Error fetching brains:', error);
        brainList.innerHTML = '<div class="error-brains">Error loading brains. Please try again.</div>';
      });
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
