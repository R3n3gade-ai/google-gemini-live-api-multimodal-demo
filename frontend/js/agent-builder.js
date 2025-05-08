/**
 * Agent Builder Integration
 * Handles the direct link to the containerized google-adk-nocode application
 */
document.addEventListener('DOMContentLoaded', () => {
  const agentBuilderBtn = document.querySelector('.nav-button[data-feature="agent-builder"]');
  
  if (agentBuilderBtn) {
    agentBuilderBtn.setAttribute('href', 'https://user:5601d5feaae9622152e6a5da2f4ba473@google-gemini-demo-tunnel-0hdiersd.devinapps.com');
    agentBuilderBtn.setAttribute('target', '_blank');
    agentBuilderBtn.setAttribute('rel', 'noopener noreferrer');
    
    agentBuilderBtn.addEventListener('click', () => {
      console.log('Opening Agent Builder in new tab');
    });
  }
});
