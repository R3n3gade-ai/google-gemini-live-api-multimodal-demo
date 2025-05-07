/**
 * System Prompt Toggle Functionality
 * Handles collapsible system prompt UI
 */
document.addEventListener('DOMContentLoaded', () => {
  const systemPromptToggle = document.getElementById('systemPromptToggle');
  const systemPromptContent = document.getElementById('systemPromptContent');
  const savePromptBtn = document.getElementById('savePromptBtn');
  const systemPrompt = document.getElementById('systemPrompt');
  
  if (systemPromptToggle) {
    systemPromptToggle.addEventListener('click', () => {
      systemPromptToggle.classList.toggle('active');
      systemPromptContent.classList.toggle('active');
    });
  }
  
  if (savePromptBtn) {
    savePromptBtn.addEventListener('click', () => {
      systemPromptToggle.classList.remove('active');
      systemPromptContent.classList.remove('active');
      
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
});
