/**
 * UI Controller class
 * Handles all UI updates and user interactions
 */
export class UIController {
    constructor() {
      // Cache DOM elements
      this.elements = {
        systemPrompt: document.getElementById('systemPrompt'),
        functionCalling: document.getElementById('functionCalling'),
        autoFunctionResponse: document.getElementById('autoFunctionResponse'),
        codeExecution: document.getElementById('codeExecution'),
        enableGoogleSearch: document.getElementById('enableGoogleSearch'),
        allowInterruptions: document.getElementById('allowInterruptions'),
        startAudioBtn: document.getElementById('startAudioBtn'),
        startCameraBtn: document.getElementById('startCameraBtn'),
        startScreenBtn: document.getElementById('startScreenBtn'),
        stopButton: document.getElementById('stopButton'),
        messages: document.getElementById('messages'),
        videoContainer: document.getElementById('videoContainer'),
        textInput: document.getElementById('textInput'),
        sendTextBtn: document.getElementById('sendTextBtn')
      };
      
      this.initToolsSync();
    }
    
    /**
     * Initialize synchronization between tools footer selectors and main content selectors
     */
    initToolsSync() {
    }
    
    /**
     * Get user configuration from form inputs
     * @returns {Object} - Configuration object
     */
    getConfig() {
      return {
        systemPrompt: this.elements.systemPrompt.value,
        voice: document.getElementById('tools-voice') ? document.getElementById('tools-voice').value : 'Puck',
        language: document.getElementById('tools-language') ? document.getElementById('tools-language').value : 'english',
        functionCalling: this.elements.functionCalling ? this.elements.functionCalling.checked : true,
        autoFunctionResponse: document.getElementById('tools-autoFunctionResponse') ? document.getElementById('tools-autoFunctionResponse').checked : true,
        codeExecution: this.elements.codeExecution ? this.elements.codeExecution.checked : true,
        googleSearch: document.getElementById('tools-enableGoogleSearch') ? document.getElementById('tools-enableGoogleSearch').checked : true,
        toolUsage: document.getElementById('tools-toolUsage') ? document.getElementById('tools-toolUsage').checked : true,
        allowInterruptions: document.getElementById('tools-allowInterruptions') ? document.getElementById('tools-allowInterruptions').checked : false
      };
    }
    
    /**
     * Update UI elements based on streaming state
     * @param {boolean} isStreaming - Whether streaming is active
     */
    updateUIForStreaming(isStreaming) {
      this.elements.startAudioBtn.disabled = isStreaming;
      this.elements.startCameraBtn.disabled = isStreaming;
      this.elements.startScreenBtn.disabled = isStreaming;
      this.elements.stopButton.disabled = !isStreaming;
    }
    
    /**
     * Show video preview container and hide chat container
     */
    showVideoPreview() {
      this.elements.videoContainer.classList.remove('hidden');
      this.elements.messages.parentElement.classList.add('hidden');
    }
    
    /**
     * Hide video preview container and show chat container
     */
    hideVideoPreview() {
      this.elements.videoContainer.classList.add('hidden');
      this.elements.messages.parentElement.classList.remove('hidden');
    }
    
    /**
     * Append a message to the conversation area
     * @param {string} message - Message text to display
     */
    appendMessage(message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message';
      messageDiv.textContent = message;
      
      this.elements.messages.appendChild(messageDiv);
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }
    
    /**
     * Show an error message
     * @param {string} errorText - Error message to display
     */
    showError(errorText) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'message';
      errorDiv.style.borderLeftColor = 'var(--accent-danger)';
      errorDiv.textContent = `Error: ${errorText}`;
      
      this.elements.messages.appendChild(errorDiv);
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      
      console.error(errorText);
    }
  }
