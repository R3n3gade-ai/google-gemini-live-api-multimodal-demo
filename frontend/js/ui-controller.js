/**
 * UI Controller class
 * Handles all UI updates and user interactions
 */
export class UIController {
    constructor() {
      // Cache DOM elements
      this.elements = {
        systemPrompt: document.getElementById('systemPrompt'),
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
     * @param {string} [currentMode] - The current active multimodal input mode ('audio', 'camera', 'screen', or null)
     * @returns {Object} - Configuration object
     */
    getConfig(currentMode) {
      // Get model ID from model selector if available
      const modelSelector = document.querySelector('.model-name');
      const modelId = modelSelector && modelSelector.dataset.modelId ? 
                      modelSelector.dataset.modelId : 'gemini-2.0-flash-exp';
      
      // Get structured output configuration
      const structuredOutputToggle = document.getElementById('tools-structuredOutput');
      const structuredOutputEnabled = structuredOutputToggle ? structuredOutputToggle.checked : true;
      
      // Get structured output format from the data attribute if it exists
      let structuredOutputFormat = 'json'; // Default
      if (structuredOutputToggle && structuredOutputToggle.dataset.format) {
        structuredOutputFormat = structuredOutputToggle.dataset.format;
      }
      
      // For now, we'll use default values for schema and strict validation
      // In a real implementation, these would be configurable through the UI
      const structuredOutputSchema = '';
      const structuredOutputStrict = true;
      
      const config = {
        systemPrompt: this.elements.systemPrompt.value,
        voice: document.getElementById('tools-voice') ? document.getElementById('tools-voice').value : 'Puck',
        language: document.getElementById('tools-language') ? document.getElementById('tools-language').value : 'english',
        functionCalling: document.getElementById('tools-functionCalling') ? document.getElementById('tools-functionCalling').checked : true,
        autoFunctionResponse: document.getElementById('tools-autoFunctionResponse') ? document.getElementById('tools-autoFunctionResponse').checked : true,
        codeExecution: document.getElementById('tools-codeExecution') ? document.getElementById('tools-codeExecution').checked : true,
        googleSearch: document.getElementById('tools-enableGoogleSearch') ? document.getElementById('tools-enableGoogleSearch').checked : true,
        toolUsage: document.getElementById('tools-toolUsage') ? document.getElementById('tools-toolUsage').checked : true,
        allowInterruptions: document.getElementById('tools-allowInterruptions') ? document.getElementById('tools-allowInterruptions').checked : false,
        temperature: document.getElementById('temperature-slider') ? document.getElementById('temperature-slider').value : 0.6,
        modelId: modelId,
        structuredOutput: {
          enabled: structuredOutputEnabled,
          format: structuredOutputFormat,
          schema: structuredOutputSchema,
          strict: structuredOutputStrict
        },
        // Include the current mode so the backend knows which multimodal input is active
        currentMode: currentMode
      };
      // The backend will use currentMode to decide whether to request audio output from Gemini.
      return config;
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
     * Show video preview container alongside chat container
     */
    showVideoPreview() {
      this.elements.videoContainer.classList.remove('hidden');
    }
    
    /**
     * Hide video preview container
     */
    hideVideoPreview() {
      this.elements.videoContainer.classList.add('hidden');
    }
    
    /**
     * Append a message to the conversation area
     * @param {string} message - Message text to display
     * @param {string} type - Message type (user, gemini, system, error)
     */
    appendMessage(message, type = 'system') {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message';
      
      if (type === 'user') {
        messageDiv.classList.add('user-message');
      } else if (type === 'gemini') {
        messageDiv.classList.add('gemini-message');
      } else if (type === 'error') {
        messageDiv.style.borderLeftColor = 'var(--accent-danger)';
      }
      
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
