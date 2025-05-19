/**
 * Composio client for handling tool integrations and OAuth flows
 * Interacts with the backend Composio API endpoints
 */

export class ComposioClient {
  constructor() {
    this.baseUrl = '/api/composio';
    this.activeConnections = [];
    this.availableTools = [];
  }

  /**
   * Initialize the Composio client
   * Fetch any existing connections
   */
  async initialize() {
    try {
      // Check for any OAuth callback results
      this.handleOAuthRedirectResult();
      
      // Load existing connections
      await this.loadConnections();
      
      console.log('Composio client initialized');
    } catch (error) {
      console.error('Failed to initialize Composio client:', error);
    }
  }

  /**
   * Handle OAuth redirect result if present in URL
   */
  handleOAuthRedirectResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const connectionStatus = urlParams.get('connection_status');
    const app = urlParams.get('app');
    const message = urlParams.get('message');

    if (connectionStatus) {
      // Clear the URL parameters
      const url = new URL(window.location);
      url.searchParams.delete('connection_status');
      url.searchParams.delete('app');
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url);

      // Show a notification to the user
      if (connectionStatus === 'success') {
        this.showNotification(`Successfully connected to ${app}`, 'success');
        
        // Refresh connections list
        this.loadConnections();
      } else {
        this.showNotification(`Failed to connect: ${message}`, 'error');
      }
    }
    
    // Set up message listener for OAuth popup windows
    window.addEventListener('message', async (event) => {
      if (event.data && event.data.type === 'oauth_callback') {
        if (event.data.status === 'success') {
          this.showNotification(`Successfully connected to ${event.data.app}`, 'success');
          
          // Refresh connections list
          console.log(`OAuth success for ${event.data.app}. Calling loadConnections...`);
          await this.loadConnections(); // This calls updateConnectionsUI internally
          console.log(`loadConnections complete for ${event.data.app}. Current activeConnections:`, JSON.stringify(this.activeConnections, null, 2));

          // Attempt to directly update the specific button again, just in case.
          const newlyConnectedApp = event.data.app; // e.g., "github"
          const buttonToUpdate = document.querySelector(`#connections-content .connection-button[data-app="${newlyConnectedApp}"]`);
          if (buttonToUpdate) {
            console.log(`Attempting direct update for button:`, buttonToUpdate);
            const activeConnection = this.activeConnections.find(conn => conn.appName === newlyConnectedApp && conn.status === 'ACTIVE');
            if (activeConnection) {
              const newButton = buttonToUpdate.cloneNode(true);
              newButton.classList.add('connected');
              newButton.dataset.connectionId = activeConnection.id;
              const spanElement = newButton.querySelector('span');
              if (spanElement) spanElement.textContent = this.formatAppName(newlyConnectedApp);
              newButton.onclick = (e) => {
                e.preventDefault();
                if (confirm(`Are you sure you want to disconnect from ${this.formatAppName(newlyConnectedApp)}?`)) {
                  this.disconnectApp(activeConnection.id, newButton, this.formatAppName(newlyConnectedApp));
                }
              };
              if (buttonToUpdate.parentNode) {
                buttonToUpdate.parentNode.replaceChild(newButton, buttonToUpdate);
                console.log(`Directly updated button for ${newlyConnectedApp} to connected state.`);
              }
            } else {
              console.log(`Could not find ACTIVE connection for ${newlyConnectedApp} after direct loadConnections call for button update.`);
            }
          } else {
            console.log(`Could not find button for direct update: ${newlyConnectedApp}`);
          }
        } else {
          this.showNotification(`Failed to connect: ${event.data.message}`, 'error');
        }
      }
    });
  }

  /**
   * Show a notification to the user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = 'info') {
    // Create a notification element if it doesn't exist
    let notification = document.getElementById('composio-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'composio-notification';
      notification.className = 'notification';
      document.body.appendChild(notification);
    }

    // Set notification content and style
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      notification.style.display = 'none';
    }, 5000);
  }

  /**
   * Load user connections from backend
   */
  async loadConnections() {
    try {
      const response = await fetch(`${this.baseUrl}/connections`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      this.activeConnections = data.connections || [];
      
      // Update the UI to show active connections
      this.updateConnectionsUI();
      
      return this.activeConnections;
    } catch (error) {
      console.error('Failed to load connections:', error);
      return [];
    }
  }

  /**
   * Update the connections UI to show active connections
   */
  updateConnectionsUI() {
    console.log("updateConnectionsUI called. Active connections at this moment:", JSON.stringify(this.activeConnections, null, 2));
    const allAppButtons = document.querySelectorAll('#connections-content .connection-button[data-app]');

    allAppButtons.forEach(button => {
      const appName = button.dataset.app;
      const displayName = this.formatAppName(appName);
      const spanElement = button.querySelector('span');

      // Find the first ACTIVE connection for this appName.
      const activeConnection = this.activeConnections.find(conn => conn.appName === appName);

      // To prevent adding multiple listeners, we'll store the handler and remove it first.
      // A simpler way for this specific case is to ensure this function is idempotent for listeners,
      // or only call it once after all connections are loaded/changed.
      // For now, we'll rely on the fact that loadConnections calls this once after fetching.
      // If a button's state changes, its listener *needs* to change.
      // The cloneNode approach was to ensure old listeners are gone.
      // Let's try a more direct approach: define handlers and attach/detach.

      // Remove existing listener before adding a new one.
      // This requires the listener to be a named function or stored.
      // For simplicity in this pass, we'll rely on this function being called
      // infrequently enough that a small overhead of re-adding listeners is okay,
      // but the main goal is to set the *correct* listener.
      // A better way: button.replaceWith(button.cloneNode(true)) and then add listener to the new button.
      // This was the previous approach. Let's stick to it for listener cleanup.

      const newButton = button.cloneNode(true); // Clone to easily remove old listeners
      const newSpanElement = newButton.querySelector('span');


      if (activeConnection && activeConnection.id) {
        newButton.classList.add('connected');
        newButton.dataset.connectionId = activeConnection.id;
        // Display only the app name; color will indicate connected status
        if (newSpanElement) newSpanElement.textContent = displayName;
        
        // Ensure no 'connected-static' class if we're using '.connected'
        newButton.classList.remove('connected-static');

        newButton.onclick = (e) => { // Using onclick for simplicity in replacing listener
          e.preventDefault();
          if (confirm(`Are you sure you want to disconnect from ${displayName}?`)) {
            // Pass the newButton itself for UI updates if disconnectApp needs it
            this.disconnectApp(activeConnection.id, newButton, displayName);
          }
        };
      } else {
        newButton.classList.remove('connected');
        newButton.classList.remove('connected-static');
        newButton.removeAttribute('data-connection-id');
        if (newSpanElement) newSpanElement.textContent = displayName;

        newButton.onclick = (e) => { // Using onclick for simplicity
          e.preventDefault();
          this.initiateOAuth(appName);
        };
      }
      // Replace the old button with the new one (which has the correct listener)
      if (button.parentNode) {
        button.parentNode.replaceChild(newButton, button);
      }
    });
  }

  // createConnectionButton is no longer needed.

  /**
   * Format app name for display
   * @param {string} appName - Raw app name
   * @returns {string} Formatted app name
   */
  formatAppName(appName) {
    // Replace underscores with spaces and capitalize
    return appName
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get names of all actively connected apps
   * @returns {string[]} Array of app names (e.g., ['gmail', 'github'])
   */
  getActiveConnectedAppNames() {
    if (!this.activeConnections || this.activeConnections.length === 0) {
      return [];
    }
    // Assuming each connection object in activeConnections has an 'app' property with the app name
    return this.activeConnections.map(connection => connection.app).filter(appName => !!appName);
  }

  /**
   * Initiate OAuth flow for an app
   * @param {string} appName - Name of the app to connect
   */
  async initiateOAuth(appName) {
    try {
      // Show a loading indicator
      this.showNotification(`Connecting to ${this.formatAppName(appName)}...`, 'info');
      
      // Get OAuth URL from backend
      const redirectUri = `${window.location.origin}/api/composio/oauth/callback`;
      const response = await fetch(`${this.baseUrl}/oauth/url?app_name=${appName}&redirect_uri=${encodeURIComponent(redirectUri)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.url) {
        // Calculate popup dimensions and position
        const width = 600;
        const height = 700;
        const left = (window.innerWidth - width) / 2 + window.screenX;
        const top = (window.innerHeight - height) / 2 + window.screenY;
        
        // Open the OAuth popup
        const popup = window.open(
          data.url,
          `${appName}_oauth_popup`,
          `width=${width},height=${height},left=${left},top=${top},` +
          'toolbar=no,menubar=no,location=no,status=no'
        );
        
        // Check if popup was blocked
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          throw new Error('Popup was blocked. Please allow popups for this site.');
        }
        
        // Focus the popup
        popup.focus();
        
        console.log(`Opened OAuth popup for ${appName} at URL: ${data.url}`);
      } else {
        throw new Error('No OAuth URL returned');
      }
    } catch (error) {
      console.error(`Failed to initiate OAuth for ${appName}:`, error);
      this.showNotification(`Failed to connect to ${appName}: ${error.message}`, 'error');
    }
  }

  /**
   * Get available tools for a specific app
   * @param {string} appName - Name of the app
   * @returns {Promise<Array>} Array of available tools
   */
  async getTools(appName) {
    try {
      const response = await fetch(`${this.baseUrl}/tools?apps=${appName}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      return data.tools || [];
    } catch (error) {
      console.error(`Failed to get tools for ${appName}:`, error);
      return [];
    }
  }

  /**
   * Disconnect an app by its connection ID
   * @param {string} connectionId - The ID of the connection to disconnect
   * @param {HTMLElement} buttonElement - The button element to update its UI state
   * @param {string} displayName - The display name of the app for notifications
   */
  async disconnectApp(connectionId, buttonElement, displayName) {
    console.log(`disconnectApp called for ID: ${connectionId}, displayName: ${displayName}, button:`, buttonElement);
    try {
      this.showNotification(`Disconnecting from ${displayName}...`, 'info');
      const response = await fetch(`${this.baseUrl}/connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Backend disconnect call for ${connectionId} successful.`);
        this.showNotification(`Successfully disconnected from ${displayName}`, 'success');
        
        // Refresh connections list from backend and update UI
        await this.loadConnections();

      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error during disconnect' }));
        console.error(`Error response from backend disconnect: ${response.status}`, errorData);
        const errorMessage = errorData.detail || `HTTP error ${response.status}`;
        this.showNotification(`Failed to disconnect from ${displayName}: ${errorMessage}`, 'error');
        // Do not update UI or activeConnections if backend reports failure
      }

    } catch (error) {
      console.error(`Failed to disconnect app (ID: ${connectionId}):`, error);
      this.showNotification(`Failed to disconnect from ${displayName}: ${error.message}`, 'error');
    }
  }

  /**
   * Execute a Composio tool
   * @param {string} toolName - Name of the tool to execute
   * @param {Object} params - Tool parameters
   * @returns {Promise<Object>} Tool execution result
   */
  async executeTool(toolName, params) {
    try {
      const response = await fetch(`${this.baseUrl}/tools/${toolName}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to execute tool ${toolName}:`, error);
      throw error;
    }
  }
}