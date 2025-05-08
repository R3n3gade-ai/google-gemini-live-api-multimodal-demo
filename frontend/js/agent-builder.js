/**
 * Agent Builder Integration
 * Handles the direct link to the containerized google-adk-nocode application
 */
document.addEventListener('DOMContentLoaded', () => {
  const agentBuilderBtn = document.querySelector('.nav-button[data-feature="agent-builder"]');
  
  if (agentBuilderBtn) {
    agentBuilderBtn.removeAttribute('href');
    
    agentBuilderBtn.setAttribute('target', '_blank');
    agentBuilderBtn.setAttribute('rel', 'noopener noreferrer');
    
    agentBuilderBtn.addEventListener('click', (e) => {
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
          
          if (window.location.hostname === 'localhost') {
            window.open('http://localhost:8080', '_blank', 'noopener,noreferrer');
            console.log('Falling back to localhost:8080');
          } else {
            alert('Failed to open Agent Builder. Please try again later.');
          }
        });
    });
  }
});
