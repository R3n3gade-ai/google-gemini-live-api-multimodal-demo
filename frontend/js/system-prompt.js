/**
 * System Prompt Modal Functionality
 * Handles system prompt popup UI
 */
document.addEventListener('DOMContentLoaded', () => {
  const systemPromptBtn = document.getElementById('systemPromptBtn');
  const systemPromptModal = document.getElementById('systemPromptModal');
  const closeSystemPromptModal = document.getElementById('closeSystemPromptModal');
  const saveSystemPromptBtn = document.getElementById('saveSystemPromptBtn');
  const cancelSystemPromptBtn = document.getElementById('cancelSystemPromptBtn');
  const systemPrompt = document.getElementById('systemPrompt');
  
  // Store original prompt value for cancel functionality
  let originalPromptValue = systemPrompt ? systemPrompt.value : 'You are a friendly AI Assistant.';
  
  if (systemPromptBtn) {
    systemPromptBtn.addEventListener('click', () => {
      if (systemPromptModal) {
        originalPromptValue = systemPrompt.value;
        systemPromptModal.classList.add('active');
      }
    });
  }
  
  if (closeSystemPromptModal) {
    closeSystemPromptModal.addEventListener('click', () => {
      if (systemPromptModal) {
        systemPromptModal.classList.remove('active');
      }
    });
  }
  
  // Cancel button functionality
  if (cancelSystemPromptBtn) {
    cancelSystemPromptBtn.addEventListener('click', () => {
      if (systemPrompt) {
        systemPrompt.value = originalPromptValue;
      }
      
      if (systemPromptModal) {
        systemPromptModal.classList.remove('active');
      }
    });
  }
  
  // Save button functionality
  if (saveSystemPromptBtn) {
    saveSystemPromptBtn.addEventListener('click', () => {
      if (systemPromptModal) {
        systemPromptModal.classList.remove('active');
      }
      
      const messages = document.getElementById('messages');
      if (messages) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.textContent = 'System prompt updated';
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
      }
    });
  }
  
  window.addEventListener('click', (event) => {
    if (event.target === systemPromptModal) {
      systemPromptModal.classList.remove('active');
      
      if (systemPrompt) {
        systemPrompt.value = originalPromptValue;
      }
    }
  });
});
