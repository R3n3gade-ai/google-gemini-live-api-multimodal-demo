/**
 * UI Controller class
 * Handles all UI updates and user interactions
 */
export class UIController {
    constructor() {
      // Cache DOM elements
      this.elements = {
        systemPrompt: document.getElementById('systemPrompt'),
        voice: document.getElementById('voice'),
        language: document.getElementById('language'),
        functionCalling: document.getElementById('functionCalling'),
        autoFunctionResponse: document.getElementById('autoFunctionResponse'),
        codeExecution: document.getElementById('codeExecution'),
        enableGoogleSearch: document.getElementById('enableGoogleSearch'),
        toolUsage: document.getElementById('toolUsage'),
        allowInterruptions: document.getElementById('allowInterruptions'),
        startAudioBtn: document.getElementById('startAudioBtn'),
        startCameraBtn: document.getElementById('startCameraBtn'),
        startScreenBtn: document.getElementById('startScreenBtn'),
        stopButton: document.getElementById('stopButton'),
        messages: document.getElementById('messages'),
        videoContainer: document.getElementById('videoContainer'),
        
        toolsVoice: document.getElementById('tools-voice'),
        toolsLanguage: document.getElementById('tools-language'),
        toolsToolUsage: document.getElementById('tools-toolUsage'),
        toolsAllowInterruptions: document.getElementById('tools-allowInterruptions')
      };
      
      this.initToolsSync();
    }
    
    /**
     * Initialize synchronization between tools footer selectors and main content selectors
     */
    initToolsSync() {
      if (this.elements.toolsVoice && this.elements.voice) {
        this.elements.toolsVoice.value = this.elements.voice.value;
        
        this.elements.voice.addEventListener('change', () => {
          this.elements.toolsVoice.value = this.elements.voice.value;
        });
        
        this.elements.toolsVoice.addEventListener('change', () => {
          this.elements.voice.value = this.elements.toolsVoice.value;
        });
      }
      
      if (this.elements.toolsLanguage && this.elements.language) {
        this.elements.toolsLanguage.value = this.elements.language.value;
        
        this.elements.language.addEventListener('change', () => {
          this.elements.toolsLanguage.value = this.elements.language.value;
        });
        
        this.elements.toolsLanguage.addEventListener('change', () => {
          this.elements.language.value = this.elements.toolsLanguage.value;
        });
      }
      
      if (this.elements.toolsToolUsage && this.elements.toolUsage) {
        this.elements.toolsToolUsage.checked = this.elements.toolUsage.checked;
        
        this.elements.toolUsage.addEventListener('change', () => {
          this.elements.toolsToolUsage.checked = this.elements.toolUsage.checked;
        });
        
        this.elements.toolsToolUsage.addEventListener('change', () => {
          this.elements.toolUsage.checked = this.elements.toolsToolUsage.checked;
        });
      }
      
      if (this.elements.toolsAllowInterruptions && this.elements.allowInterruptions) {
        this.elements.toolsAllowInterruptions.checked = this.elements.allowInterruptions.checked;
        
        this.elements.allowInterruptions.addEventListener('change', () => {
          this.elements.toolsAllowInterruptions.checked = this.elements.allowInterruptions.checked;
        });
        
        this.elements.toolsAllowInterruptions.addEventListener('change', () => {
          this.elements.allowInterruptions.checked = this.elements.toolsAllowInterruptions.checked;
        });
      }
    }
    
    /**
     * Get user configuration from form inputs
     * @returns {Object} - Configuration object
     */
    getConfig() {
      // Use tools-footer selectors if available, otherwise use main content selectors
      const voice = this.elements.toolsVoice && this.elements.toolsVoice.value || this.elements.voice.value;
      const language = this.elements.toolsLanguage && this.elements.toolsLanguage.value || this.elements.language.value;
      const toolUsage = this.elements.toolsToolUsage && this.elements.toolsToolUsage.checked || this.elements.toolUsage.checked;
      const allowInterruptions = this.elements.toolsAllowInterruptions && this.elements.toolsAllowInterruptions.checked || this.elements.allowInterruptions.checked;
      
      return {
        systemPrompt: this.elements.systemPrompt.value,
        voice: voice,
        language: language,
        functionCalling: this.elements.functionCalling.checked,
        autoFunctionResponse: this.elements.autoFunctionResponse.checked,
        codeExecution: this.elements.codeExecution.checked,
        googleSearch: this.elements.enableGoogleSearch.checked,
        toolUsage: toolUsage,
        allowInterruptions: allowInterruptions
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
      if (message.includes("WebSocket")) {
        return;
      }
      
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
