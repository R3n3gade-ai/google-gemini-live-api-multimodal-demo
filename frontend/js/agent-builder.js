/**
 * Agent Builder Integration
 * Handles the direct link to the containerized google-adk-nocode application
 */
document.addEventListener('DOMContentLoaded', () => {
  const agentBuilderBtn = document.querySelector('.nav-button[data-feature="agent-builder"]');
  
  if (agentBuilderBtn) {
    agentBuilderBtn.setAttribute('href', '#');
    
    agentBuilderBtn.style.cursor = 'pointer';
    
    agentBuilderBtn.setAttribute('target', '_blank');
    agentBuilderBtn.setAttribute('rel', 'noopener noreferrer');
    
    if (window.location.hostname === 'localhost') {
      agentBuilderBtn.setAttribute('href', 'http://localhost:8080');
      console.log('Agent Builder button configured for localhost');
    }
    
    agentBuilderBtn.addEventListener('click', (e) => {
      if (window.location.hostname !== 'localhost') {
        e.preventDefault();
        
        console.log('Fetching Agent Builder URL...');
        
        fetch('/api/agent-builder-url')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data && data.url) {
              window.open(data.url, '_blank', 'noopener,noreferrer');
              console.log('Opening Agent Builder at', data.url);
            } else {
              throw new Error('No Agent Builder URL provided by the server');
            }
          })
          .catch(error => {
            console.error('Error fetching Agent Builder URL:', error);
            
            alert('Failed to open Agent Builder. Please try again later or check if the Agent Builder container is running.');
          });
      }
    });
  }
});
