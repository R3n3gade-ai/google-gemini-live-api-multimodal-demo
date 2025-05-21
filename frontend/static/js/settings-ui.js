/**
 * Settings UI Controller
 * 
 * This module handles the settings panel UI interactions, including:
 * - Opening/closing the settings panel
 * - Updating settings values
 * - Saving settings to local storage
 * - Applying settings to the Gemini client
 */

// DOM Elements
const settingsPanel = document.getElementById('settings-panel');
const settingsToggle = document.getElementById('settings-toggle');
const settingsCloseBtn = document.getElementById('settings-close');
const settingsForm = document.getElementById('settings-form');
const modelSelector = document.getElementById('model-selector');
const temperatureSlider = document.getElementById('temperature-slider');
const temperatureValue = document.getElementById('temperature-value');
const voiceSelector = document.getElementById('voice-selector');
const languageSelector = document.getElementById('language-selector');
const systemPromptInput = document.getElementById('system-prompt');
const saveSettingsBtn = document.getElementById('save-settings');

// Default settings
const DEFAULT_SETTINGS = {
  systemPrompt: "You are a friendly AI Assistant.",
  voice: "Aoede",
  language: "english",
  functionCalling: true,
  autoFunctionResponse: true,
  codeExecution: false,
  googleSearch: true,
  toolUsage: true,
  allowInterruptions: false,
  temperature: "0.6",
  modelId: "gemini-2.0-flash-exp",
  structuredOutput: {
    enabled: false,
    format: "json",
    schema: "",
    strict: true
  }
};

// Available models
const AVAILABLE_MODELS = [
  { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash" },
  { id: "gemini-2.0-pro-exp", name: "Gemini 2.0 Pro" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: "gemini-1.0-pro", name: "Gemini 1.0 Pro" }
];

// Available voices
const AVAILABLE_VOICES = [
  { id: "Aoede", name: "Aoede (Female)" },
  { id: "Puck", name: "Puck (Male)" },
  { id: "Ember", name: "Ember (Female)" },
  { id: "Cael", name: "Cael (Male)" }
];

// Current settings
let currentSettings = { ...DEFAULT_SETTINGS };

/**
 * Initialize the settings UI
 */
function initSettingsUI() {
  // Load settings from local storage
  loadSettings();
  
  // Populate model selector
  populateModelSelector();
  
  // Populate voice selector
  populateVoiceSelector();
  
  // Set up event listeners
  setupEventListeners();
  
  // Update UI with current settings
  updateSettingsUI();
}

/**
 * Load settings from local storage
 */
function loadSettings() {
  const savedSettings = localStorage.getItem('geminiSettings');
  if (savedSettings) {
    try {
      currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    } catch (error) {
      console.error('Error parsing saved settings:', error);
      currentSettings = { ...DEFAULT_SETTINGS };
    }
  }
}

/**
 * Save settings to local storage
 */
function saveSettings() {
  localStorage.setItem('geminiSettings', JSON.stringify(currentSettings));
}

/**
 * Populate the model selector dropdown
 */
function populateModelSelector() {
  if (!modelSelector) return;
  
  modelSelector.innerHTML = '';
  AVAILABLE_MODELS.forEach(model => {
    const option = document.createElement('option');
    option.value = model.id;
    option.textContent = model.name;
    modelSelector.appendChild(option);
  });
}

/**
 * Populate the voice selector dropdown
 */
function populateVoiceSelector() {
  if (!voiceSelector) return;
  
  voiceSelector.innerHTML = '';
  AVAILABLE_VOICES.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.id;
    option.textContent = voice.name;
    voiceSelector.appendChild(option);
  });
}

/**
 * Set up event listeners for settings UI
 */
function setupEventListeners() {
  // Toggle settings panel
  if (settingsToggle) {
    settingsToggle.addEventListener('click', () => {
      settingsPanel.classList.toggle('open');
    });
  }
  
  // Close settings panel
  if (settingsCloseBtn) {
    settingsCloseBtn.addEventListener('click', () => {
      settingsPanel.classList.remove('open');
    });
  }
  
  // Temperature slider
  if (temperatureSlider) {
    temperatureSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      temperatureValue.textContent = value;
      currentSettings.temperature = value;
    });
  }
  
  // Save settings button
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveSettingsFromForm();
      applySettings();
      settingsPanel.classList.remove('open');
    });
  }
}

/**
 * Update the UI with current settings
 */
function updateSettingsUI() {
  if (modelSelector) modelSelector.value = currentSettings.modelId;
  if (temperatureSlider) {
    temperatureSlider.value = currentSettings.temperature;
    temperatureValue.textContent = currentSettings.temperature;
  }
  if (voiceSelector) voiceSelector.value = currentSettings.voice;
  if (languageSelector) languageSelector.value = currentSettings.language;
  if (systemPromptInput) systemPromptInput.value = currentSettings.systemPrompt;
  
  // Update checkboxes
  updateCheckbox('function-calling', currentSettings.functionCalling);
  updateCheckbox('auto-function-response', currentSettings.autoFunctionResponse);
  updateCheckbox('code-execution', currentSettings.codeExecution);
  updateCheckbox('google-search', currentSettings.googleSearch);
  updateCheckbox('tool-usage', currentSettings.toolUsage);
  updateCheckbox('allow-interruptions', currentSettings.allowInterruptions);
  updateCheckbox('structured-output', currentSettings.structuredOutput.enabled);
}

/**
 * Update a checkbox element with the given value
 */
function updateCheckbox(id, value) {
  const checkbox = document.getElementById(id);
  if (checkbox) checkbox.checked = value;
}

/**
 * Save settings from the form inputs
 */
function saveSettingsFromForm() {
  if (modelSelector) currentSettings.modelId = modelSelector.value;
  if (temperatureSlider) currentSettings.temperature = temperatureSlider.value;
  if (voiceSelector) currentSettings.voice = voiceSelector.value;
  if (languageSelector) currentSettings.language = languageSelector.value;
  if (systemPromptInput) currentSettings.systemPrompt = systemPromptInput.value;
  
  // Get checkbox values
  currentSettings.functionCalling = getCheckboxValue('function-calling');
  currentSettings.autoFunctionResponse = getCheckboxValue('auto-function-response');
  currentSettings.codeExecution = getCheckboxValue('code-execution');
  currentSettings.googleSearch = getCheckboxValue('google-search');
  currentSettings.toolUsage = getCheckboxValue('tool-usage');
  currentSettings.allowInterruptions = getCheckboxValue('allow-interruptions');
  currentSettings.structuredOutput.enabled = getCheckboxValue('structured-output');
  
  // Save to local storage
  saveSettings();
}

/**
 * Get the value of a checkbox element
 */
function getCheckboxValue(id) {
  const checkbox = document.getElementById(id);
  return checkbox ? checkbox.checked : false;
}

/**
 * Apply settings to the Gemini client
 */
function applySettings() {
  // If websocket client is available, send settings
  if (window.websocketClient && typeof window.websocketClient.setConfig === 'function') {
    window.websocketClient.setConfig(currentSettings);
  } else {
    console.warn('WebSocket client not available, settings not applied');
  }
}

/**
 * Get the current settings
 */
function getSettings() {
  return { ...currentSettings };
}

// Initialize settings UI when DOM is loaded
document.addEventListener('DOMContentLoaded', initSettingsUI);

// Export functions for use in other modules
window.settingsUI = {
  getSettings,
  applySettings,
  updateSettingsUI,
  initSettingsUI
};
