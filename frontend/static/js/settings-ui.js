document.addEventListener('DOMContentLoaded', () => {
  const temperatureSlider = document.getElementById('temperature-slider');
  const temperatureValue = document.querySelector('.temperature-value');
  
  if (temperatureSlider && temperatureValue) {
    temperatureSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      temperatureValue.textContent = value;
      
      const percentage = ((value - temperatureSlider.min) / (temperatureSlider.max - temperatureSlider.min)) * 100;
      temperatureSlider.style.background = `linear-gradient(to right, #3b82f6 ${percentage}%, #333 ${percentage}%)`;
    });
    
    const initialValue = temperatureSlider.value;
    const initialPercentage = ((initialValue - temperatureSlider.min) / (temperatureSlider.max - temperatureSlider.min)) * 100;
    temperatureSlider.style.background = `linear-gradient(to right, #3b82f6 ${initialPercentage}%, #333 ${initialPercentage}%)`;
  }
  
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      alert('Edit functionality would open a configuration modal');
    });
  });
  
  const tokenCounter = document.querySelector('.token-value');
  if (tokenCounter) {
    const updateTokenCount = () => {
      const usedTokens = Math.floor(Math.random() * 1000);
      const maxTokens = 1048576;
      tokenCounter.textContent = `${usedTokens.toLocaleString()} / ${maxTokens.toLocaleString()}`;
    };
    
    updateTokenCount();
    setInterval(updateTokenCount, 30000); // Update every 30 seconds
  }
  
  const modelSelector = document.querySelector('.model-name');
  if (modelSelector) {
    modelSelector.addEventListener('click', () => {
      alert('Model selection would open a dropdown of available models');
    });
  }
});
