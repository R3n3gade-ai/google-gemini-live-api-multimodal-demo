/**
 * Agent Builder Integration
 * Handles the direct link to the containerized google-adk-nocode application
 */
document.addEventListener('DOMContentLoaded', () => {
  const agentBuilderBtn = document.querySelector('.nav-button[data-feature="agent-builder"]');
  
  if (agentBuilderBtn) {
    agentBuilderBtn.setAttribute('href', 'http://localhost:8080');
    agentBuilderBtn.setAttribute('target', '_blank');
    agentBuilderBtn.setAttribute('rel', 'noopener noreferrer');
    
    if (window.location.hostname !== 'localhost') {
      fetch('/api/agent-builder-url')
        .then(response => response.json())
        .then(data => {
          if (data && data.url) {
            agentBuilderBtn.setAttribute('href', data.url);
          }
        })
        .catch(error => {
          console.error('Error fetching Agent Builder URL:', error);
        });
    }
  }
});
