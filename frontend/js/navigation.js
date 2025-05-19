/**
 * Navigation Tab Functionality
 * Handles tab switching for left and right navigation menus
 * and manages integration with Composio connections
 */
document.addEventListener('DOMContentLoaded', () => {
  // Tab Navigation
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      const tabGroup = button.parentElement.classList.contains('left-nav-tabs') ? 'left' : 'right';
      
      const groupTabs = document.querySelectorAll(`.${tabGroup}-nav-tabs .tab-btn`);
      groupTabs.forEach(tab => tab.classList.remove('active'));
      
      const groupContent = document.querySelectorAll(`.${tabGroup}-nav .tab-content`);
      groupContent.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      
      const contentId = `${tabName}-content`;
      const content = document.getElementById(contentId);
      if (content) {
        content.classList.add('active');
      }
      
      // For the connections tab, trigger a refresh when it's selected
      if (tabName === 'connections' && window.composioClient) {
        window.composioClient.loadConnections();
      }
    });
  });
  
  // Initialize connection modal
  const connectionModal = document.getElementById('connectionModal');
  const addConnectionBtn = document.getElementById('addConnectionBtn');
  const closeConnectionModal = document.getElementById('closeConnectionModal');
  const cancelConnectionBtn = document.getElementById('cancelConnectionBtn');
  const addConnectionConfirmBtn = document.getElementById('addConnectionConfirmBtn');
  
  if (addConnectionBtn && connectionModal) {
    // Open connection modal
    addConnectionBtn.addEventListener('click', () => {
      connectionModal.style.display = 'flex';
    });
    
    // Close connection modal with X button
    if (closeConnectionModal) {
      closeConnectionModal.addEventListener('click', () => {
        connectionModal.style.display = 'none';
      });
    }
    
    // Close connection modal with Cancel button
    if (cancelConnectionBtn) {
      cancelConnectionBtn.addEventListener('click', () => {
        connectionModal.style.display = 'none';
      });
    }
    
    // Close connection modal when clicking outside
    window.addEventListener('click', (event) => {
      if (event.target === connectionModal) {
        connectionModal.style.display = 'none';
      }
    });
    
    // Setup app selection in modal
    const appItems = connectionModal.querySelectorAll('.connection-app-item');
    let selectedApp = null;
    
    appItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove selected class from all items
        appItems.forEach(i => i.classList.remove('selected'));
        
        // Add selected class to clicked item
        item.classList.add('selected');
        
        // Store selected app
        selectedApp = item.dataset.app;
      });
    });
    
    // Add connection button logic
    if (addConnectionConfirmBtn) {
      addConnectionConfirmBtn.addEventListener('click', () => {
        if (selectedApp && window.composioClient) {
          // Initiate OAuth flow for selected app
          window.composioClient.initiateOAuth(selectedApp);
          
          // Reset and close modal
          selectedApp = null;
          appItems.forEach(i => i.classList.remove('selected'));
          connectionModal.style.display = 'none';
        } else {
          alert('Please select an app to connect');
        }
      });
    }
  }
  
  // Setup connection buttons click behavior
  const connectionButtons = document.querySelectorAll('.connection-button[data-app]');
  connectionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (window.composioClient) {
        const appName = button.dataset.app;
        
        // Check if already connected
        if (button.classList.contains('connected')) {
          // Show disconnect confirmation
          if (confirm(`Are you sure you want to disconnect from ${appName}?`)) {
            // TODO: Implement disconnect logic
            alert(`Disconnected from ${appName}`);
            button.classList.remove('connected');
          }
        } else {
          // Initiate OAuth flow
          window.composioClient.initiateOAuth(appName);
        }
      }
    });
  });
});
