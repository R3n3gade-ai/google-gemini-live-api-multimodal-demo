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

window.addBrainButton = function(brain) {
  const promptBox = document.querySelector('.text-input-container');
  if (!promptBox) return;
  
  const existingButtons = document.querySelectorAll('.brain-button');
  if (existingButtons.length >= 4) return;
  
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
  
  promptBox.parentNode.insertBefore(brainButton, promptBox.nextSibling);
};

document.addEventListener('DOMContentLoaded', () => {
  const brainButton = document.querySelector('.nav-button[data-feature="brain-setup"]');
  
  window.currentStep = 1;
  
  const initBrainSetup = () => {
    brainButton.addEventListener('click', window.openBrainSetup);
    
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
    const existingButtons = document.querySelectorAll('.brain-button');
    existingButtons.forEach(button => button.remove());
    
    const addTestBrains = () => {
      const testBrains = [
        { id: 'test1', name: 'Work Brain', active: true },
        { id: 'test2', name: 'Personal', active: false },
        { id: 'test3', name: 'Research', active: false },
        { id: 'test4', name: 'Creative', active: false }
      ];
      
      testBrains.forEach(brain => {
        window.addBrainButton(brain);
      });
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
