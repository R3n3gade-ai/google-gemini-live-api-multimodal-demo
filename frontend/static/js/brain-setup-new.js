window.brainData = {
  brainId: null,
  identity: {
    name: '',
    description: ''
  },
  memories: [],
  training: {
    synthesisMode: 'medium',
    baseModel: 'Gemini-2.0-Flash',
    learningRate: 0.0001,
    epochs: 3,
    threads: 2,
    enableGPU: false,
    thinkingModel: false
  }
};

window.addBrainButton = function(brain) {
  const leftNav = document.querySelector('.left-nav');
  if (!leftNav) return;
  
  let leftNavBrainWrapper = document.querySelector('.left-nav-brain-wrapper');
  if (!leftNavBrainWrapper) {
    leftNavBrainWrapper = document.createElement('div');
    leftNavBrainWrapper.className = 'left-nav-brain-wrapper';
    leftNav.appendChild(leftNavBrainWrapper);
  }
  
  const existingButtons = leftNavBrainWrapper.querySelectorAll('.brain-button');
  if (existingButtons.length >= 4) return;
  
  const brainButton = document.createElement('button');
  brainButton.className = 'brain-button left-nav-brain-button';
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
  
  leftNavBrainWrapper.appendChild(brainButton);
};

document.addEventListener('DOMContentLoaded', () => {
  const brainButton = document.querySelector('.nav-button[data-feature="brain-setup"]');
  
  window.currentStep = 1;
  
  const initBrainSetup = () => {
    brainButton.addEventListener('click', window.openBrainSetup);
    
    setTimeout(() => {
      window.fetchExistingBrains();
    }, 500);
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
    const existingButtons = document.querySelectorAll('.brain-button');
    existingButtons.forEach(button => button.remove());
    
    const addTestBrains = () => {
      console.log('Adding test brains to left nav');
      const testBrains = [
        { id: 'test1', name: 'Work Brain', active: true },
        { id: 'test2', name: 'Personal', active: false },
        { id: 'test3', name: 'Research', active: false },
        { id: 'test4', name: 'Creative', active: false }
      ];
      
      testBrains.forEach(brain => {
        window.addBrainButton(brain);
      });
      
      console.log('Brain buttons created:', document.querySelectorAll('.left-nav-brain-button').length);
    };
    
    window.fetchBrainsAPI()
      .then(brains => {
        if (brains.length === 0) {
          addTestBrains();
          return;
        }
        
        brains.slice(0, 4).forEach(brain => {
          window.addBrainButton(brain);
        });
      })
      .catch(error => {
        console.error('Error fetching brains:', error);
        addTestBrains();
      });
  };
  
  initBrainSetup();
});
