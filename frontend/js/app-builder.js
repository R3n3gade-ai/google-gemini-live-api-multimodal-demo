/**
 * App/Web Builder Integration
 * Connects the AI Workstation to the App/Web Builder
 */

document.addEventListener('DOMContentLoaded', () => {
  const appBuilderButton = document.querySelector('.nav-button[data-feature="app-builder"]');
  
  if (appBuilderButton) {
    appBuilderButton.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'app-builder-modal';
      modal.innerHTML = `
        <div class="app-builder-modal-content">
          <div class="app-builder-modal-header">
            <h2>App/Web Builder</h2>
            <button class="app-builder-close-button">&times;</button>
          </div>
          <div class="app-builder-modal-body">
            <iframe src="https://user:d43662c50a7556be215825839ae4a456@google-gemini-demo-tunnel-0me6wvgy.devinapps.com" width="100%" height="100%" frameborder="0"></iframe>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      const closeButton = modal.querySelector('.app-builder-close-button');
      closeButton.addEventListener('click', () => {
        modal.remove();
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    });
  }
});
