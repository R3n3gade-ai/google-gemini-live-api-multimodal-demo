window.brainData = {
  brainId: null,
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

window.addBrainToList = function(brain) {
  const brainContainer = document.getElementById('brainContainer');
  if (!brainContainer) return;
  
  if (brainContainer.children.length >= 4) return;
  
  const brainButton = document.createElement('button');
  brainButton.className = 'brain-button';
  brainButton.dataset.brainId = brain.id;
  brainButton.innerHTML = `
    <i class="fas fa-brain"></i>
    <span>${brain.name}</span>
  `;
  
  if (brain.active) {
    brainButton.classList.add('active');
  }
  
  brainButton.addEventListener('click', () => {
    const isActive = brainButton.classList.contains('active');
    window.toggleBrainAPI(brain.id, !isActive)
      .then(() => {
        brainButton.classList.toggle('active');
        console.log(`Brain ${brain.id} toggled to ${!isActive ? 'active' : 'inactive'}`);
      });
  });
  
  brainContainer.appendChild(brainButton);
};

document.addEventListener('DOMContentLoaded', () => {
  const brainButton = document.querySelector('.nav-button[data-feature="brain-setup"]');
  
  window.currentStep = 1;
  
  const initBrainSetup = () => {
    brainButton.addEventListener('click', window.openBrainSetup);
    
    window.createBrainContainer();
    
    window.fetchExistingBrains();
  };
  
  window.openBrainSetup = () => {
    window.createBrainSetupContainer();
  };
  
  window.closeBrainSetup = () => {
    const container = document.getElementById('brainSetupContainer');
    if (container) {
      container.classList.remove('active');
      setTimeout(() => {
        container.remove();
      }, 300);
    }
  };
  
  window.fetchExistingBrains = () => {
    const brainContainer = document.getElementById('brainContainer');
    if (!brainContainer) return;
    
    brainContainer.innerHTML = '<div class="loading-brains">Loading...</div>';
    
    const addTestBrains = () => {
      brainContainer.innerHTML = '';
      
      const testBrains = [
        { id: 'test1', name: 'Work Brain', active: true },
        { id: 'test2', name: 'Personal', active: false },
        { id: 'test3', name: 'Research', active: false },
        { id: 'test4', name: 'Creative', active: false }
      ];
      
      testBrains.forEach(brain => {
        window.addBrainToList(brain);
      });
    };
    
    window.fetchBrainsAPI()
      .then(brains => {
        brainContainer.innerHTML = '';
        
        if (brains.length === 0) {
          addTestBrains();
          return;
        }
        
        brains.slice(0, 4).forEach(brain => {
          window.addBrainToList(brain);
        });
      })
      .catch(error => {
        console.error('Error fetching brains:', error);
        addTestBrains();
      });
  };
  
  window.createBrainContainer = () => {
    if (document.getElementById('brainContainer')) {
      return;
    }
    
    const brainArea = document.createElement('div');
    brainArea.id = 'brainArea';
    brainArea.className = 'brain-area';
    
    const container = document.createElement('div');
    container.id = 'brainContainer';
    container.className = 'brain-button-container';
    
    brainArea.appendChild(container);
    
    const cardBody = document.querySelector('.card-body');
    
    if (cardBody) {
      cardBody.appendChild(brainArea);
    }
  };
  
  initBrainSetup();
});
