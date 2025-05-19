/**
 * WebSocket client for communicating with the Gemini backend
 * Handles connection setup, data transmission, and event handling
 */
export class WebSocketClient {
    constructor() {
      this.websocket = null;
      this.clientId = null;
      this.callbacks = {
        onMessage: null,
        onClose: null,
        onError: null
      };
    }
  
    /**
     * Establish WebSocket connection and configure event handlers
     * @param {Object} config - Configuration for Gemini
     * @param {Object} callbacks - Event callbacks
     * @returns {Promise} - Resolves when connection is established
     */
    connect(config, callbacks) {
      return new Promise((resolve, reject) => {
        // Generate a unique ID for this client session
        this.clientId = crypto.randomUUID();
        
        // Store callbacks
        this.callbacks = callbacks;
        
        // Create WebSocket connection using backend server
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        
        // For tunnel URLs, we need to use the exposed backend URL
        let wsUrl;
        if (window.location.hostname.includes('devinapps.com')) {
          // For exposed ports, we need to use the exposed backend URL
          const backendTunnelId = '9mpnkjjw';
          wsUrl = `${protocol}//user:d675778612fe63f29e9829976317c535@second-brain-app-tunnel-${backendTunnelId}.devinapps.com/ws/${this.clientId}`;
          console.log("Using exposed backend WebSocket URL:", wsUrl);
        } else {
          wsUrl = `${protocol}//${window.location.host}/ws/${this.clientId}`;
          console.log("Using local WebSocket URL:", wsUrl);
        }
        
        console.log("Connecting to WebSocket:", wsUrl);
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
          console.log("WebSocket connection established");
          
          // Send initial configuration
          this.websocket.send(JSON.stringify({
            type: 'config',
            config: config
          }));
          
          resolve();
        };
        
        this.websocket.onmessage = (event) => {
          const response = JSON.parse(event.data);
          if (this.callbacks.onMessage) {
            this.callbacks.onMessage(response);
          }
        };
        
        this.websocket.onclose = () => {
          console.log("WebSocket connection closed");
          if (this.callbacks.onClose) {
            this.callbacks.onClose();
          }
        };
        
        this.websocket.onerror = (error) => {
          console.error("WebSocket error:", error);
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
          reject(error);
        };
      });
    }
    
    /**
     * Check if websocket is connected
     * @returns {boolean} - True if connected
     */
    isConnected() {
      return this.websocket && this.websocket.readyState === WebSocket.OPEN;
    }
    
    /**
     * Send audio data to the server
     * @param {string} base64Audio - Base64 encoded audio data
     */
    sendAudio(base64Audio) {
      if (!this.isConnected()) return;
      
      this.websocket.send(JSON.stringify({
        type: 'audio',
        data: base64Audio
      }));
    }
    
    /**
     * Send image data to the server
     * @param {string} base64Image - Base64 encoded image data
     */
    sendImage(base64Image) {
      if (!this.isConnected()) return;
      
      this.websocket.send(JSON.stringify({
        type: 'image',
        data: base64Image
      }));
    }
    
    /**
     * Send text message to the server
     * @param {string} text - Text to send
     */
    sendText(text) {
      if (!this.isConnected()) return;
      
      this.websocket.send(JSON.stringify({
        type: 'text',
        data: text
      }));
    }
    
    /**
     * Execute a Composio tool via WebSocket
     * @param {string} toolName - Name of the tool to execute
     * @param {Object} parameters - Tool parameters
     * @returns {Promise} - Resolves when tool execution is complete
     */
    executeComposioTool(toolName, parameters) {
      if (!this.isConnected()) {
        return Promise.reject(new Error('WebSocket not connected'));
      }
      
      return new Promise((resolve, reject) => {
        try {
          // Create a unique ID for this tool execution
          const executionId = crypto.randomUUID();
          
          // Create message payload
          const message = {
            type: 'execute_tool',
            tool: {
              name: toolName,
              parameters: parameters
            },
            execution_id: executionId
          };
          
          // Send the message
          this.websocket.send(JSON.stringify(message));
          
          // Tool execution is asynchronous, so we'll resolve immediately
          // The result will come back as a separate message
          resolve();
          
        } catch (error) {
          reject(error);
        }
      });
    }
    
    /**
     * Close the WebSocket connection
     */
    disconnect() {
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
      }
    }
  }
