/**
 * Composio Integration UI handler
 * Manages connection modals and UI interactions for Composio integrations
 */

// Import the ComposioClient class
import { ComposioClient } from './composio-client.js';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeComposioIntegration();
});

/**
 * Initialize Composio integration UI and functionality
 */
function initializeComposioIntegration() {
  // Initialize Composio client
  const composioClient = new ComposioClient();
  composioClient.initialize();
  
  // Store as global for access from console for debugging
  window.composioClient = composioClient;
  
  // Initialize connection modal
  initializeConnectionModal(composioClient);
  
  // Initialize connection buttons
  initializeConnectionButtons(composioClient);

  console.log('Composio integration initialized');
}

/**
 * Initialize connection modal functionality
 * @param {ComposioClient} composioClient - Composio client instance
 */
function initializeConnectionModal(composioClient) {
  const modal = document.getElementById('connectionModal');
  const addConnectionBtn = document.getElementById('addConnectionBtn');
  const closeConnectionModalBtn = document.getElementById('closeConnectionModal');
  const cancelConnectionBtn = document.getElementById('cancelConnectionBtn');
  const addConnectionConfirmBtn = document.getElementById('addConnectionConfirmBtn');
  
  if (!modal || !addConnectionBtn) return;
  
  // Open modal button
  addConnectionBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
  
  // Close modal buttons
  if (closeConnectionModalBtn) {
    closeConnectionModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  if (cancelConnectionBtn) {
    cancelConnectionBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Handle app selection in modal
  const appItems = modal.querySelectorAll('.connection-app-item');
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
  
  // Add connection button
  if (addConnectionConfirmBtn) {
    addConnectionConfirmBtn.addEventListener('click', () => {
      if (selectedApp) {
        // Initiate OAuth flow for selected app
        composioClient.initiateOAuth(selectedApp);
        
        // Reset and close modal
        selectedApp = null;
        appItems.forEach(i => i.classList.remove('selected'));
        modal.style.display = 'none';
      } else {
        alert('Please select an app to connect');
      }
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

/**
 * Initialize connection buttons in the connections tab
 * @param {ComposioClient} composioClient - Composio client instance
 */
function initializeConnectionButtons(composioClient) {
  // Find all connection buttons. This might need to be more dynamic if buttons are added/removed.
  // For now, it initializes listeners for buttons present at DOMContentLoaded.
  // If new buttons are added by composioClient.updateConnectionsUI(), those need listeners too.
  // A better approach might be event delegation on a parent container.
  // However, composioClient.createConnectionButton already adds its own specific listener.
  // This function might be redundant if createConnectionButton handles all cases,
  // or it might be for pre-existing static buttons in the HTML.
  // Assuming this targets static buttons that might not have been processed by createConnectionButton.

  const staticConnectionButtons = document.querySelectorAll('.connection-button[data-app]:not([data-connection-id])');
  
  staticConnectionButtons.forEach(button => {
    const appName = button.dataset.app;
    // This listener is for buttons that are NOT yet connected.
    // Connected buttons get their listeners from composioClient.createConnectionButton.
    if (!button.classList.contains('connected')) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        composioClient.initiateOAuth(appName);
      });
    }
  });

  // The disconnect logic is now primarily handled within composioClient.createConnectionButton's click listener.
  // This function, initializeConnectionButtons, might be simplified or removed if all buttons
  // are dynamically created and managed by composioClient.updateConnectionsUI and createConnectionButton.
  // For now, leaving the structure but noting that the disconnect part of the TODO is resolved
  // within composio-client.js.
  console.log("initializeConnectionButtons in composio-integration.js called. Disconnect logic is now in composio-client.js's createConnectionButton.");
}

/**
 * Add Composio tools to the Gemini client
 * @param {Object} geminiConfig - Gemini configuration object
 * @param {string[]} apps - List of app names to get tools for
 * @returns {Promise<Object>} - Updated Gemini configuration
 */
export async function addComposioToolsToGemini(geminiConfig, apps = ['gmail']) {
  try {
    const composioClient = new ComposioClient();
    const tools = await composioClient.getTools(apps.join(','));
    
    if (tools && tools.length > 0) {
      // Add Composio tools to Gemini config
      if (!geminiConfig.tools) {
        geminiConfig.tools = [];
      }
      
      geminiConfig.tools.push(...tools);
      console.log('Added Composio tools to Gemini config:', tools);
    }
    
    return geminiConfig;
  } catch (error) {
    console.error('Failed to add Composio tools to Gemini:', error);
    return geminiConfig;
  }
}