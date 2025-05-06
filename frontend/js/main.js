/**
 * Main application entry point
 * Initializes all components and sets up event listeners
 */

import { AudioManager } from './audio-manager.js';
import { VideoManager } from './video-manager.js';
import { WebSocketClient } from './websocket-client.js';
import { UIController } from './ui-controller.js';

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
    
    // Add click handlers
    this.startAudioBtn.addEventListener('click', () => this.startStream('audio'));
    this.startCameraBtn.addEventListener('click', () => this.startStream('camera'));
    this.startScreenBtn.addEventListener('click', () => this.startStream('screen'));
    this.stopButton.addEventListener('click', () => this.stopStream());
  }
  
  /**
   * Initialize WebSocket connection on page load
   */
  async initWebSocket() {
    try {
      // Get configuration from UI
      const config = this.uiController.getConfig();
      
      // Initialize WebSocket connection
      await this.webSocketClient.connect(config, {
        onMessage: this.handleWebSocketMessage.bind(this),
        onClose: this.handleWebSocketClose.bind(this),
        onError: this.handleWebSocketError.bind(this)
      });
      
      this.webSocketConnected = true;
      this.uiController.appendMessage('WebSocket connected and ready');
    } catch (error) {
      this.uiController.showError(`WebSocket connection failed: ${error.message}`);
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
      if (!this.webSocketConnected) {
        await this.initWebSocket();
      }
      
      // Initialize audio capture
      await this.audioManager.startCapture((audioData) => {
        this.webSocketClient.sendAudio(audioData);
      });
      
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
    if (!this.isStreaming) return;
    
    // Clean up resources (but keep WebSocket connected)
    this.audioManager.stopCapture();
    this.videoManager.stopCapture();
    
    // Reset state
    this.isStreaming = false;
    this.currentMode = null;
    
    // Update UI
    this.uiController.updateUIForStreaming(false);
    this.uiController.hideVideoPreview();
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
        this.uiController.appendMessage(`[Gemini Text] ${response.text}`);
        break;
        
      case 'turn_complete':
        this.uiController.appendMessage('[Gemini Turn Complete]');
        break;
        
      default:
        this.uiController.appendMessage(`[Unknown] ${JSON.stringify(response)}`);
    }
  }
  
  /**
   * Handle WebSocket connection close
   */
  handleWebSocketClose() {
    this.uiController.appendMessage('WebSocket disconnected - attempting to reconnect...');
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
    this.uiController.showError(`WebSocket error: ${error.message}`);
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GeminiApp();
});
