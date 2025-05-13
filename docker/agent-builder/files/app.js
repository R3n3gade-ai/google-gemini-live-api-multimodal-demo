// Modified app.js to handle fetch requests without credentials in URL
document.addEventListener('DOMContentLoaded', initialize);

// Global variables
let models = [];
let tools = [];
let templates = [];
let agents = [];
let currentView = 'new-agent';
let selectedTemplate = null;

/**
 * Initialize the application
 */
async function initialize() {
    try {
        showLoading();
        await Promise.all([
            fetchModels(),
            fetchTools(),
            fetchTemplates(),
            fetchAgents()
        ]);
        showNewAgentView();
    } catch (error) {
        showError('Failed to initialize the application. Please refresh the page.');
        console.error('Initialization error:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Fetch available models from the API
 */
async function fetchModels() {
    try {
        // Use relative URL to avoid credentials issues
        const response = await fetch('/api/models', {
            credentials: 'same-origin'
        });
        const data = await response.json();
        models = data.models;
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
}

/**
 * Fetch available tools from the API
 */
async function fetchTools() {
    try {
        // Use relative URL to avoid credentials issues
        const response = await fetch('/api/tools', {
            credentials: 'same-origin'
        });
        const data = await response.json();
        tools = data.tools;
    } catch (error) {
        console.error('Error fetching tools:', error);
        throw error;
    }
}

/**
 * Fetch available templates from the API
 */
async function fetchTemplates() {
    try {
        // Use relative URL to avoid credentials issues
        const response = await fetch('/api/templates', {
            credentials: 'same-origin'
        });
        const data = await response.json();
        templates = data.templates;
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
}

/**
 * Fetch existing agents from the API
 */
async function fetchAgents() {
    try {
        // Use relative URL to avoid credentials issues
        const response = await fetch('/api/agents', {
            credentials: 'same-origin'
        });
        const data = await response.json();
        agents = data.agents;
    } catch (error) {
        console.error('Error fetching agents:', error);
        throw error;
    }
}
