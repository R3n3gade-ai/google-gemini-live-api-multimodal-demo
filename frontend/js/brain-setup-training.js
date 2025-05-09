
window.loadTrainingStep = function(container) {
  const content = document.createElement('div');
  
  const synthesisGroup = document.createElement('div');
  synthesisGroup.className = 'form-group';
  
  const synthesisLabel = document.createElement('div');
  synthesisLabel.className = 'form-label';
  synthesisLabel.textContent = 'Data Synthesis Mode';
  
  const synthesisModes = document.createElement('div');
  synthesisModes.className = 'synthesis-modes';
  
  const modes = [
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' }
  ];
  
  modes.forEach(mode => {
    const modeElement = document.createElement('div');
    modeElement.className = `synthesis-mode ${mode.id === window.brainData.training.synthesisMode ? 'active' : ''}`;
    modeElement.textContent = mode.label;
    modeElement.dataset.mode = mode.id;
    
    modeElement.addEventListener('click', () => {
      document.querySelectorAll('.synthesis-mode').forEach(el => el.classList.remove('active'));
      modeElement.classList.add('active');
      window.brainData.training.synthesisMode = mode.id;
    });
    
    synthesisModes.appendChild(modeElement);
  });
  
  const synthesisDescription = document.createElement('div');
  synthesisDescription.className = 'synthesis-description';
  synthesisDescription.textContent = 'Low: Fast data synthesis. Medium: Balanced synthesis and speed. High: Rich synthesis, slower speed.';
  
  synthesisGroup.appendChild(synthesisLabel);
  synthesisGroup.appendChild(synthesisModes);
  synthesisGroup.appendChild(synthesisDescription);
  content.appendChild(synthesisGroup);
  
  const modelStep = document.createElement('div');
  modelStep.className = 'training-step';
  
  const modelTitle = document.createElement('div');
  modelTitle.className = 'training-step-title';
  modelTitle.textContent = 'Step 2: Choose Base Model for Training Second Me';
  
  const modelDescription = document.createElement('div');
  modelDescription.className = 'training-step-description';
  modelDescription.textContent = 'Base model for training your Second Me. Choose based on your available system resources.';
  
  const selectWrapper = document.createElement('div');
  selectWrapper.className = 'select-wrapper';
  
  const modelSelect = document.createElement('select');
  modelSelect.className = 'form-select';
  
  const models = [
    { id: 'Qwen2-0.5B-Instruct', label: 'Qwen2-0.5B-Instruct (8GB+ RAM Recommended)' },
    { id: 'Llama-2-7B', label: 'Llama-2-7B (16GB+ RAM Recommended)' },
    { id: 'Mistral-7B', label: 'Mistral-7B (16GB+ RAM Recommended)' }
  ];
  
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = model.label;
    option.selected = model.id === window.brainData.training.baseModel;
    modelSelect.appendChild(option);
  });
  
  modelSelect.addEventListener('change', (e) => {
    window.brainData.training.baseModel = e.target.value;
  });
  
  selectWrapper.appendChild(modelSelect);
  modelStep.appendChild(modelTitle);
  modelStep.appendChild(modelDescription);
  modelStep.appendChild(selectWrapper);
  content.appendChild(modelStep);
  
  const advancedStep = document.createElement('div');
  advancedStep.className = 'training-step';
  
  const advancedTitle = document.createElement('div');
  advancedTitle.className = 'training-step-title';
  advancedTitle.textContent = 'Step 3: Configure Advanced Training Parameters';
  
  const advancedDescription = document.createElement('div');
  advancedDescription.className = 'training-step-description';
  advancedDescription.textContent = 'Adjust these parameters to control training quality and performance. Recommended settings will ensure stable training.';
  
  const learningRateGroup = document.createElement('div');
  learningRateGroup.className = 'form-group';
  
  const learningRateLabel = document.createElement('label');
  learningRateLabel.className = 'form-label';
  learningRateLabel.textContent = 'Learning Rate';
  learningRateLabel.innerHTML += ' <i class="fas fa-info-circle info-icon"></i>';
  
  const learningRateInput = document.createElement('input');
  learningRateInput.type = 'number';
  learningRateInput.className = 'form-input';
  learningRateInput.value = window.brainData.training.learningRate;
  learningRateInput.step = '0.00001';
  learningRateInput.min = '0.00001';
  learningRateInput.max = '0.005';
  
  const learningRateDescription = document.createElement('div');
  learningRateDescription.className = 'form-description';
  learningRateDescription.textContent = 'Enter a value between 0.00001 and 0.005 (recommended: 0.0001)';
  
  learningRateInput.addEventListener('input', (e) => {
    window.brainData.training.learningRate = parseFloat(e.target.value);
  });
  
  learningRateGroup.appendChild(learningRateLabel);
  learningRateGroup.appendChild(learningRateInput);
  learningRateGroup.appendChild(learningRateDescription);
  
  const epochsGroup = document.createElement('div');
  epochsGroup.className = 'form-group';
  
  const epochsLabel = document.createElement('label');
  epochsLabel.className = 'form-label';
  epochsLabel.textContent = 'Number of Epochs';
  epochsLabel.innerHTML += ' <i class="fas fa-info-circle info-icon"></i>';
  
  const epochsInput = document.createElement('input');
  epochsInput.type = 'number';
  epochsInput.className = 'form-input';
  epochsInput.value = window.brainData.training.epochs;
  epochsInput.min = '1';
  epochsInput.max = '10';
  
  const epochsDescription = document.createElement('div');
  epochsDescription.className = 'form-description';
  epochsDescription.textContent = 'Enter an integer between 1 and 10 (recommended: 3)';
  
  epochsInput.addEventListener('input', (e) => {
    window.brainData.training.epochs = parseInt(e.target.value);
  });
  
  epochsGroup.appendChild(epochsLabel);
  epochsGroup.appendChild(epochsInput);
  epochsGroup.appendChild(epochsDescription);
  
  const threadsGroup = document.createElement('div');
  threadsGroup.className = 'form-group';
  
  const threadsLabel = document.createElement('label');
  threadsLabel.className = 'form-label';
  threadsLabel.textContent = 'Concurrency Threads';
  threadsLabel.innerHTML += ' <i class="fas fa-info-circle info-icon"></i>';
  
  const threadsInput = document.createElement('input');
  threadsInput.type = 'number';
  threadsInput.className = 'form-input';
  threadsInput.value = window.brainData.training.threads;
  threadsInput.min = '1';
  threadsInput.max = '10';
  
  const threadsDescription = document.createElement('div');
  threadsDescription.className = 'form-description';
  threadsDescription.textContent = 'Enter an integer between 1 and 10 (recommended: 2)';
  
  threadsInput.addEventListener('input', (e) => {
    window.brainData.training.threads = parseInt(e.target.value);
  });
  
  threadsGroup.appendChild(threadsLabel);
  threadsGroup.appendChild(threadsInput);
  threadsGroup.appendChild(threadsDescription);
  
  const gpuGroup = document.createElement('div');
  gpuGroup.className = 'form-group';
  
  const gpuLabel = document.createElement('label');
  gpuLabel.className = 'form-label';
  gpuLabel.textContent = 'Enable CUDA GPU Acceleration';
  gpuLabel.innerHTML += ' <i class="fas fa-info-circle info-icon"></i>';
  
  const gpuToggle = document.createElement('label');
  gpuToggle.className = 'toggle-wrapper';
  
  const gpuInput = document.createElement('input');
  gpuInput.type = 'checkbox';
  gpuInput.className = 'toggle-input';
  gpuInput.checked = window.brainData.training.enableGPU;
  
  const gpuDisplay = document.createElement('span');
  gpuDisplay.className = 'toggle-display';
  
  const gpuStatus = document.createElement('div');
  gpuStatus.className = 'form-description';
  gpuStatus.textContent = 'CUDA acceleration is not available on this system.';
  
  gpuInput.addEventListener('change', (e) => {
    window.brainData.training.enableGPU = e.target.checked;
  });
  
  gpuToggle.appendChild(gpuInput);
  gpuToggle.appendChild(gpuDisplay);
  
  gpuGroup.appendChild(gpuLabel);
  gpuGroup.appendChild(gpuToggle);
  gpuGroup.appendChild(gpuStatus);
  
  const behaviorStep = document.createElement('div');
  behaviorStep.className = 'training-step';
  
  const behaviorTitle = document.createElement('div');
  behaviorTitle.className = 'training-step-title';
  behaviorTitle.textContent = 'Step 4: Configure Advanced Behavior';
  
  const thinkingGroup = document.createElement('div');
  thinkingGroup.className = 'form-group';
  
  const thinkingToggle = document.createElement('label');
  thinkingToggle.className = 'toggle-wrapper';
  
  const thinkingInput = document.createElement('input');
  thinkingInput.type = 'checkbox';
  thinkingInput.className = 'toggle-input';
  thinkingInput.checked = window.brainData.training.thinkingModel;
  
  const thinkingDisplay = document.createElement('span');
  thinkingDisplay.className = 'toggle-display';
  
  const thinkingLabel = document.createElement('span');
  thinkingLabel.className = 'toggle-label';
  thinkingLabel.textContent = 'Thinking Model';
  
  thinkingInput.addEventListener('change', (e) => {
    window.brainData.training.thinkingModel = e.target.checked;
  });
  
  thinkingToggle.appendChild(thinkingInput);
  thinkingToggle.appendChild(thinkingDisplay);
  thinkingToggle.appendChild(thinkingLabel);
  
  thinkingGroup.appendChild(thinkingToggle);
  
  advancedStep.appendChild(advancedTitle);
  advancedStep.appendChild(advancedDescription);
  advancedStep.appendChild(learningRateGroup);
  advancedStep.appendChild(epochsGroup);
  advancedStep.appendChild(threadsGroup);
  advancedStep.appendChild(gpuGroup);
  content.appendChild(advancedStep);
  
  behaviorStep.appendChild(behaviorTitle);
  behaviorStep.appendChild(thinkingGroup);
  content.appendChild(behaviorStep);
  
  const footer = document.createElement('div');
  footer.className = 'brain-setup-footer';
  
  const backButton = document.createElement('button');
  backButton.className = 'btn btn-secondary';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => {
    window.loadStep(2);
  });
  
  const startTrainingButton = document.createElement('button');
  startTrainingButton.className = 'btn btn-primary';
  startTrainingButton.textContent = 'Start Training';
  startTrainingButton.addEventListener('click', () => {
    window.startTraining();
  });
  
  footer.appendChild(backButton);
  footer.appendChild(startTrainingButton);
  
  container.appendChild(content);
  container.appendChild(footer);
}

window.startTraining = function() {
  const stepContent = document.getElementById('brainSetupStepContent');
  stepContent.innerHTML = '';
  
  const loadingContent = document.createElement('div');
  loadingContent.style.textAlign = 'center';
  loadingContent.style.padding = '40px 0';
  
  const loadingIcon = document.createElement('div');
  loadingIcon.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #3b82f6; margin-bottom: 24px;"></i>';
  
  const loadingText = document.createElement('div');
  loadingText.textContent = 'Training your brain...';
  loadingText.style.fontSize = '1.2rem';
  loadingText.style.color = '#fff';
  
  const loadingSubtext = document.createElement('div');
  loadingSubtext.textContent = 'This may take a few minutes. Please do not close this window.';
  loadingSubtext.style.fontSize = '0.9rem';
  loadingSubtext.style.color = '#999';
  loadingSubtext.style.marginTop = '8px';
  
  loadingContent.appendChild(loadingIcon);
  loadingContent.appendChild(loadingText);
  loadingContent.appendChild(loadingSubtext);
  
  stepContent.appendChild(loadingContent);
  
  window.startTrainingAPI(window.brainData)
    .then(response => {
      window.showTrainingSuccess(response);
    })
    .catch(error => {
      window.showTrainingError(error);
    });
}

window.showTrainingSuccess = function(response) {
  const stepContent = document.getElementById('brainSetupStepContent');
  stepContent.innerHTML = '';
  
  const successContent = document.createElement('div');
  successContent.style.textAlign = 'center';
  successContent.style.padding = '40px 0';
  
  const successIcon = document.createElement('div');
  successIcon.innerHTML = '<i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 24px;"></i>';
  
  const successText = document.createElement('div');
  successText.textContent = 'Brain Training Complete!';
  successText.style.fontSize = '1.2rem';
  successText.style.color = '#fff';
  
  const successSubtext = document.createElement('div');
  successSubtext.textContent = 'Your brain has been successfully trained and is ready to use.';
  successSubtext.style.fontSize = '0.9rem';
  successSubtext.style.color = '#999';
  successSubtext.style.marginTop = '8px';
  
  successContent.appendChild(successIcon);
  successContent.appendChild(successText);
  successContent.appendChild(successSubtext);
  
  stepContent.appendChild(successContent);
  
  const footer = document.querySelector('.brain-setup-footer');
  footer.innerHTML = '';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'btn btn-primary';
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    window.closeBrainSetup();
    window.fetchExistingBrains(); // Refresh brain list
  });
  
  footer.appendChild(closeButton);
  
  window.addBrainToList({
    id: response?.id || `brain-${Date.now()}`,
    name: window.brainData.identity.name,
    description: window.brainData.identity.description,
    active: false
  });
}

window.showTrainingError = function(error) {
  const stepContent = document.getElementById('brainSetupStepContent');
  stepContent.innerHTML = '';
  
  const errorContent = document.createElement('div');
  errorContent.style.textAlign = 'center';
  errorContent.style.padding = '40px 0';
  
  const errorIcon = document.createElement('div');
  errorIcon.innerHTML = '<i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #ef4444; margin-bottom: 24px;"></i>';
  
  const errorText = document.createElement('div');
  errorText.textContent = 'Training Failed';
  errorText.style.fontSize = '1.2rem';
  errorText.style.color = '#fff';
  
  const errorSubtext = document.createElement('div');
  errorSubtext.textContent = error?.message || 'An error occurred during training. Please try again.';
  errorSubtext.style.fontSize = '0.9rem';
  errorSubtext.style.color = '#999';
  errorSubtext.style.marginTop = '8px';
  
  errorContent.appendChild(errorIcon);
  errorContent.appendChild(errorText);
  errorContent.appendChild(errorSubtext);
  
  stepContent.appendChild(errorContent);
  
  const footer = document.querySelector('.brain-setup-footer');
  footer.innerHTML = '';
  
  const retryButton = document.createElement('button');
  retryButton.className = 'btn btn-primary';
  retryButton.textContent = 'Retry';
  retryButton.addEventListener('click', () => {
    window.loadStep(3);
  });
  
  const closeButton = document.createElement('button');
  closeButton.className = 'btn btn-secondary';
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', window.closeBrainSetup);
  
  footer.appendChild(closeButton);
  footer.appendChild(retryButton);
}
