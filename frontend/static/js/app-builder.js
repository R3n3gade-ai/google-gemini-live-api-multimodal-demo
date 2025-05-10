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
            <iframe src="http://localhost:2150" width="100%" height="100%" frameborder="0"></iframe>
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
