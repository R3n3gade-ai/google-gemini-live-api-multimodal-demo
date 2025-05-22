/**
 * Main application entry point
 * Initializes all components and sets up event listeners
 */

import { AudioManager } from './audio-manager.js';
import { VideoManager } from './video-manager.js';
import { WebSocketClient } from './websocket-client.js';
import { UIController } from './ui-controller.js';
import { addComposioToolsToGemini } from './composio-integration.js';

class GeminiApp {
  constructor() {
    // Initialize managers
    this.audioManager = new AudioManager();
    this.videoManager = new VideoManager();
    this.webSocketClient = new WebSocketClient();
    this.uiController = new UIController();
    
    // App state
    this.isStreaming = false;
    this.currentMode = null; // 'audio', 'camera', or 'screen'
    this.webSocketConnected = false;
    this.composioEnabled = true; // Enable Composio integration by default
    
    // Initialize
    this.initEventListeners();
    this.initWebSocket();
  }
  
  /**
   * Set up event listeners for UI buttons
   */
  initEventListeners() {
    // Button references
    this.startAudioBtn = document.getElementById('startAudioBtn');
    this.startCameraBtn = document.getElementById('startCameraBtn');
    this.startScreenBtn = document.getElementById('startScreenBtn');
    this.stopButton = document.getElementById('stopButton');
    this.textInput = document.getElementById('textInput');
    this.sendTextBtn = document.getElementById('sendTextBtn');
    
    // Add click handlers
    this.startAudioBtn.addEventListener('click', () => this.startStream('audio'));
    this.startCameraBtn.addEventListener('click', () => this.startStream('camera'));
    this.startScreenBtn.addEventListener('click', () => this.startStream('screen'));
    this.stopButton.addEventListener('click', () => this.stopStream());
    
    this.sendTextBtn.addEventListener('click', () => this.sendTextMessage());
    this.textInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendTextMessage();
      }
    });
  }
  
  /**
   * Initialize WebSocket connection on page load
   */
  async initWebSocket() {
    try {
      // Get configuration from UI, passing the current mode
      let config = this.uiController.getConfig(this.currentMode);
      
      // Add Composio tools to config if enabled
      if (this.composioEnabled && window.composioClient) {
        const activeAppNames = window.composioClient.getActiveConnectedAppNames();
        if (activeAppNames && activeAppNames.length > 0) {
          console.log('Dynamically loading tools for apps:', activeAppNames);
          config = await addComposioToolsToGemini(config, activeAppNames);
        } else {
          console.log('No active Composio apps found, or composioClient not ready. Skipping tool loading.');
          // Optionally, load default tools or no tools if none are connected
          // For now, it will proceed without Composio tools if none are active.
        }
      } else if (this.composioEnabled) {
        console.warn('Composio is enabled, but window.composioClient is not available at initWebSocket.');
      }
      
      // Initialize WebSocket connection
      await this.webSocketClient.connect(config, {
        onMessage: this.handleWebSocketMessage.bind(this),
        onClose: this.handleWebSocketClose.bind(this),
        onError: this.handleWebSocketError.bind(this)
      });
      
      this.webSocketConnected = true;
      console.log('WebSocket connected and ready');
    } catch (error) {
      console.error(`WebSocket connection failed: ${error.message}`);
      setTimeout(() => this.initWebSocket(), 3000);
    }
  }
  
  /**
   * Start streaming with the selected mode (audio, camera, screen)
   */
  async startStream(mode) {
    if (this.isStreaming) return;

    this.currentMode = mode;

    try {
      // If WebSocket is already connected and we are starting a non-text mode,
      // disconnect and re-initialize to send the updated config with the new mode.
      if (this.webSocketConnected && mode !== 'text') {
        console.log(`WebSocket already connected. Disconnecting to re-initialize for mode: ${mode}`);
        this.webSocketClient.disconnect();
        this.webSocketConnected = false; // Set to false immediately
      }

      // Initialize WebSocket connection (will connect if not already connected or if disconnected above)
      if (!this.webSocketConnected) {
        await this.initWebSocket();
      }

      // Get configuration from UI, passing the current mode
      // This call happens *after* initWebSocket, ensuring the latest config is used for sending data.
      const config = this.uiController.getConfig(this.currentMode);

      if (mode !== 'text') {
        await this.audioManager.startCapture((audioData) => {
          this.webSocketClient.sendAudio(audioData);
        });
      }

      // Initialize video if needed
      if (mode !== 'audio') {
        await this.videoManager.startCapture(mode, (imageData) => {
          this.webSocketClient.sendImage(imageData);
        });
        this.uiController.showVideoPreview();
      }

      // Update UI state
      this.isStreaming = true;
      this.uiController.updateUIForStreaming(true);

    } catch (error) {
      this.uiController.showError(`Failed to start: ${error.message}`);
    }
  }
  
  /**
   * Stop all streaming and clean up resources
   */
  stopStream() {
    // Clean up resources (but keep WebSocket connected)
    if (this.isStreaming) {
      this.audioManager.stopCapture();
      this.videoManager.stopCapture();
      
      // Reset state
      this.isStreaming = false;
      this.currentMode = null;
      
      // Update UI
      this.uiController.updateUIForStreaming(false);
      this.uiController.hideVideoPreview();
    }
    
    this.stopButton.classList.add('hidden');
    this.stopButton.disabled = true;
  }
  
  /**
   * Handle incoming WebSocket messages
   */
  handleWebSocketMessage(response) {
    switch (response.type) {
      case 'audio':
        this.audioManager.playAudio(response.data);
        break;
        
      case 'text':
        this.uiController.appendMessage(response.text, 'gemini');
        break;
        
      case 'turn_complete':
        console.log('Gemini turn complete');
        break;
        
      case 'tool_call':
        // Handle Composio tool call
        this.handleComposioToolCall(response.data);
        break;
        
      case 'tool_result':
        // Display tool result in UI
        this.uiController.appendMessage(
          `Tool Result: ${JSON.stringify(response.data, null, 2)}`,
          'tool'
        );
        break;
        
      default:
        console.log('Unknown message type:', response);
    }
  }
  
  /**
   * Handle Composio tool call from Gemini
   * @param {Object} toolCall - Tool call data
   */
  async handleComposioToolCall(toolCall) {
    try {
      console.log('Tool call received:', toolCall);
      
      // Display tool call in UI
      this.uiController.appendMessage(
        `Executing tool: ${toolCall.name}\nParameters: ${JSON.stringify(toolCall.parameters, null, 2)}`,
        'tool'
      );
      
      // As per Step 3 of the plan, the backend now handles tool execution directly
      // when Gemini issues a functionCall. The frontend no longer sends an
      // 'executeComposioTool' message. This method now only serves to display
      // the "Executing tool..." message in the UI.
      console.log(`Frontend: Tool call for ${toolCall.name} noted. Backend will execute.`);
    } catch (error) {
      console.error('Error displaying tool call:', error);
      this.uiController.showError(`Tool execution failed: ${error.message}`);
    }
  }
  
  /**
   * Handle WebSocket connection close
   */
  handleWebSocketClose() {
    console.log('WebSocket disconnected - attempting to reconnect...');
    this.webSocketConnected = false;
    this.stopStream();
    
    setTimeout(() => {
      if (!this.webSocketConnected) {
        this.initWebSocket();
      }
    }, 2000);
  }
  
  /**
   * Handle WebSocket errors
   */
  handleWebSocketError(error) {
    console.error(`WebSocket error: ${error.message}`);
  }
  
  /**
   * Send text message to Gemini
   */
  sendTextMessage() {
    if (!this.textInput.value.trim()) return;
    
    try {
      if (!this.webSocketConnected) {
        this.initWebSocket().then(() => {
          this.sendTextMessageInternal();
        });
      } else {
        this.sendTextMessageInternal();
      }
      
    } catch (error) {
      this.uiController.showError(`Failed to send message: ${error.message}`);
    }
  }
  
  /**
   * Internal method to send text message after ensuring WebSocket is connected
   */
  sendTextMessageInternal() {
    this.uiController.appendMessage(this.textInput.value, 'user');
    
    this.webSocketClient.sendText(this.textInput.value);
    
    this.textInput.value = '';
    
    // Only show stop button for streaming modes (audio, camera, screen)
    if (this.isStreaming) {
      this.stopButton.classList.remove('hidden');
      this.stopButton.disabled = false;
    }
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GeminiApp();
  
  // Initialize Composio integration UI
  // This will be handled by the composio-integration.js module
});
