
function loadIdentityStep(container) {
  const content = document.createElement('div');
  
  const subtitle = document.createElement('div');
  subtitle.className = 'brain-setup-subtitle';
  subtitle.textContent = 'Build your AI\'s foundation with your basic information.';
  content.appendChild(subtitle);
  
  const nameGroup = document.createElement('div');
  nameGroup.className = 'form-group';
  
  const nameLabel = document.createElement('label');
  nameLabel.className = 'form-label';
  nameLabel.textContent = 'Second Me Name';
  
  const nameDescription = document.createElement('div');
  nameDescription.className = 'form-description';
  nameDescription.textContent = 'This name will represent you and your Second Me.';
  
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'form-input';
  nameInput.id = 'brainName';
  nameInput.value = brainData.identity.name;
  nameInput.maxLength = 50;
  nameInput.addEventListener('input', (e) => {
    brainData.identity.name = e.target.value;
    updateCharCount(e.target, nameCharCount);
  });
  
  const nameCharCount = document.createElement('div');
  nameCharCount.className = 'char-count';
  nameCharCount.textContent = `${brainData.identity.name.length}/50 characters`;
  
  nameGroup.appendChild(nameLabel);
  nameGroup.appendChild(nameDescription);
  nameGroup.appendChild(nameInput);
  nameGroup.appendChild(nameCharCount);
  content.appendChild(nameGroup);
  
  const descGroup = document.createElement('div');
  descGroup.className = 'form-group';
  
  const descLabel = document.createElement('label');
  descLabel.className = 'form-label';
  descLabel.textContent = 'Short Personal Description';
  
  const descDescription = document.createElement('div');
  descDescription.className = 'form-description';
  descDescription.textContent = 'Briefly describe yourself: personality, motivation, or style.';
  
  const descInput = document.createElement('textarea');
  descInput.className = 'form-textarea';
  descInput.id = 'brainDescription';
  descInput.value = brainData.identity.description;
  descInput.maxLength = 500;
  descInput.addEventListener('input', (e) => {
    brainData.identity.description = e.target.value;
    updateCharCount(e.target, descCharCount);
  });
  
  const descCharCount = document.createElement('div');
  descCharCount.className = 'char-count';
  descCharCount.textContent = `${brainData.identity.description.length}/500 characters`;
  
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descDescription);
  descGroup.appendChild(descInput);
  descGroup.appendChild(descCharCount);
  content.appendChild(descGroup);
  
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  
  const emailLabel = document.createElement('label');
  emailLabel.className = 'form-label';
  emailLabel.textContent = 'Email of Second Me';
  
  const emailDescription = document.createElement('div');
  emailDescription.className = 'form-description';
  emailDescription.textContent = 'This email will be used as a contact point for your Second Me. You can use your own email address.';
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.className = 'form-input';
  emailInput.id = 'brainEmail';
  emailInput.value = brainData.identity.email;
  emailInput.addEventListener('input', (e) => {
    brainData.identity.email = e.target.value;
  });
  
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailDescription);
  emailGroup.appendChild(emailInput);
  content.appendChild(emailGroup);
  
  const footer = document.createElement('div');
  footer.className = 'brain-setup-footer';
  
  const nextButton = document.createElement('button');
  nextButton.className = 'btn btn-primary';
  nextButton.textContent = 'Next: Upload Memories';
  nextButton.addEventListener('click', () => {
    if (validateIdentityStep()) {
      loadStep(2);
    }
  });
  
  footer.appendChild(document.createElement('div')); // Empty div for spacing
  footer.appendChild(nextButton);
  
  container.appendChild(content);
  container.appendChild(footer);
  
  updateCharCount(nameInput, nameCharCount);
  updateCharCount(descInput, descCharCount);
}
