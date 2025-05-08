/**
 * Agent Builder Integration
 * Handles the direct link to the containerized google-adk-nocode application
 */
document.addEventListener('DOMContentLoaded', () => {
  const agentBuilderBtn = document.querySelector('.nav-button[data-feature="agent-builder"]');
  
  if (agentBuilderBtn) {
    agentBuilderBtn.removeAttribute('href');
    
    agentBuilderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (window.location.hostname === 'localhost') {
        window.open('http://localhost:8080', '_blank', 'noopener,noreferrer');
        console.log('Opening Agent Builder at localhost:8080');
      } else {
        fetch('/api/agent-builder-url')
          .then(response => response.json())
          .then(data => {
            if (data && data.url) {
              window.open(data.url, '_blank', 'noopener,noreferrer');
              console.log('Opening Agent Builder at', data.url);
            } else {
              console.error('No Agent Builder URL provided by the server');
            }
          })
          .catch(error => {
            console.error('Error fetching Agent Builder URL:', error);
            window.open('http://localhost:8080', '_blank', 'noopener,noreferrer');
          });
      }
    });
  }
});
