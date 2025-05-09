
window.createBrainSetupContainer = function() {
  if (document.getElementById('brainSetupContainer')) {
    return;
  }
  
  const container = document.createElement('div');
  container.id = 'brainSetupContainer';
  container.className = 'brain-setup-container';
  
  const content = document.createElement('div');
  content.className = 'brain-setup-content';
  
  const header = document.createElement('div');
  header.className = 'brain-setup-header';
  
  const title = document.createElement('div');
  title.className = 'brain-setup-title';
  title.textContent = 'Define Your Identity';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'brain-setup-close';
  closeButton.innerHTML = '<i class="fas fa-times"></i>';
  closeButton.addEventListener('click', window.closeBrainSetup);
  
  header.appendChild(title);
  header.appendChild(closeButton);
  
  const body = document.createElement('div');
  body.className = 'brain-setup-body';
  
  const progressIndicator = window.createProgressIndicator();
  body.appendChild(progressIndicator);
  
  const stepContent = document.createElement('div');
  stepContent.id = 'brainSetupStepContent';
  body.appendChild(stepContent);
  
  content.appendChild(header);
  content.appendChild(body);
  container.appendChild(content);
  document.body.appendChild(container);
  
  window.loadStep(1);
  
  setTimeout(() => {
    container.classList.add('active');
  }, 10);
}

window.createProgressIndicator = function() {
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'progress-indicator';
  
  const steps = [
    { number: 1, label: 'Define Identity' },
    { number: 2, label: 'Upload Memories' },
    { number: 3, label: 'Train Brain' }
  ];
  
  steps.forEach(step => {
    const stepElement = document.createElement('div');
    stepElement.className = `progress-step ${step.number === 1 ? 'active' : ''}`;
    stepElement.dataset.step = step.number;
    
    const circle = document.createElement('div');
    circle.className = 'progress-circle';
    
    const number = document.createElement('span');
    number.className = 'progress-number';
    number.textContent = step.number;
    
    const check = document.createElement('i');
    check.className = 'fas fa-check progress-check';
    
    circle.appendChild(number);
    circle.appendChild(check);
    
    const label = document.createElement('div');
    label.className = 'progress-label';
    label.textContent = step.label;
    
    stepElement.appendChild(circle);
    stepElement.appendChild(label);
    progressIndicator.appendChild(stepElement);
  });
  
  return progressIndicator;
}

window.closeBrainSetup = function() {
  const container = document.getElementById('brainSetupContainer');
  if (container) {
    container.classList.remove('active');
    setTimeout(() => {
      container.remove();
    }, 300);
  }
}

window.loadStep = function(step) {
  window.currentStep = step;
  const stepContent = document.getElementById('brainSetupStepContent');
  const title = document.querySelector('.brain-setup-title');
  
  document.querySelectorAll('.progress-step').forEach(el => {
    el.classList.remove('active');
    if (parseInt(el.dataset.step) < step) {
      el.classList.add('completed');
    }
    if (parseInt(el.dataset.step) === step) {
      el.classList.add('active');
    }
  });
  
  stepContent.innerHTML = '';
  
  switch(step) {
    case 1:
      title.textContent = 'Define Your Identity';
      window.loadIdentityStep(stepContent);
      break;
    case 2:
      title.textContent = 'Upload Memories';
      window.loadMemoriesStep(stepContent);
      break;
    case 3:
      title.textContent = 'Train Your Brain';
      window.loadTrainingStep(stepContent);
      break;
  }
}

window.updateCharCount = function(input, countElement) {
  const maxLength = input.maxLength;
  const currentLength = input.value.length;
  countElement.textContent = `${currentLength}/${maxLength} characters`;
}

window.formatFileSize = function(bytes) {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

window.fetchBrainsAPI = function() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'brain-1',
          name: 'Personal Assistant',
          description: 'Helps with scheduling and organization',
          active: true
        },
        {
          id: 'brain-2',
          name: 'Creative Writer',
          description: 'Specialized in creative writing and storytelling',
          active: false
        }
      ]);
    }, 500);
  });
}

window.toggleBrainAPI = function(brainId, active) {
  return new Promise((resolve) => {
    console.log(`Toggling brain ${brainId} to ${active ? 'active' : 'inactive'}`);
    setTimeout(resolve, 300);
  });
}

window.startTrainingAPI = function(brainData) {
  return new Promise((resolve) => {
    console.log('Starting training with data:', brainData);
    setTimeout(() => {
      resolve({
        id: `brain-${Date.now()}`,
        name: brainData.identity.name,
        status: 'success'
      });
    }, 3000);
  });
}

window.validateIdentityStep = function() {
  const nameInput = document.getElementById('brainName');
  const emailInput = document.getElementById('brainEmail');
  
  if (!nameInput.value.trim()) {
    alert('Please enter a name for your Second Me.');
    nameInput.focus();
    return false;
  }
  
  if (!emailInput.value.trim()) {
    alert('Please enter an email for your Second Me.');
    emailInput.focus();
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    alert('Please enter a valid email address.');
    emailInput.focus();
    return false;
  }
  
  return true;
}
