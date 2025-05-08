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
    
    agentBuilderBtn.addEventListener('click', (e) => {
      console.log('Opening Agent Builder in new tab');
      
      if (window.location.hostname !== 'localhost') {
        e.preventDefault();
        window.open('https://user:5601d5feaae9622152e6a5da2f4ba473@google-gemini-demo-tunnel-0hdiersd.devinapps.com', '_blank', 'noopener,noreferrer');
      }
    });
  }
});
