window.getApiConfig = function() {
  let apiBaseUrl = 'http://localhost:8000';
  let headers = {};
  
  if (window.API_GATEWAY_URL) {
    apiBaseUrl = window.API_GATEWAY_URL;
  } else if (window.location.hostname.includes('devinapps.com')) {
    apiBaseUrl = 'https://second-brain-app-tunnel-zzym0sqj.devinapps.com';
    const authString = 'user:b3835957c261e52bbff4cdc7fbdfc426';
    const base64Auth = btoa(authString);
    headers['Authorization'] = `Basic ${base64Auth}`;
  }
  
  return { apiBaseUrl, headers };
};

window.fetchBrainsAPI = async function() {
  try {
    const { apiBaseUrl, headers } = window.getApiConfig();
    const response = await fetch(`${apiBaseUrl}/second-me/roles`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch brains: ${response.status}`);
    }
    const data = await response.json();
    return data.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      active: role.active || false
    }));
  } catch (error) {
    console.error('Error fetching brains:', error);
    return [];
  }
};

window.toggleBrainAPI = async function(brainId, active) {
  try {
    const { apiBaseUrl, headers } = window.getApiConfig();
    headers['Content-Type'] = 'application/json';
    
    const response = await fetch(`${apiBaseUrl}/second-me/roles/${brainId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ active })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to toggle brain: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling brain:', error);
    throw error;
  }
};

window.createBrainAPI = async function(brainData) {
  try {
    const { apiBaseUrl, headers } = window.getApiConfig();
    headers['Content-Type'] = 'application/json';
    
    const response = await fetch(`${apiBaseUrl}/second-me/roles`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        name: brainData.identity.name,
        description: brainData.identity.description,
        training: brainData.training
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create brain: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating brain:', error);
    throw error;
  }
};

window.uploadMemoryAPI = async function(brainId, memoryData) {
  try {
    const formData = new FormData();
    
    if (memoryData.file) {
      formData.append('file', memoryData.file);
    }
    
    formData.append('brainId', brainId);
    formData.append('content', memoryData.content || '');
    formData.append('title', memoryData.title || '');
    formData.append('source', memoryData.source || '');
    
    const { apiBaseUrl, headers } = window.getApiConfig();
    const response = await fetch(`${apiBaseUrl}/second-me/memory/upload`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload memory: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading memory:', error);
    throw error;
  }
};

window.deleteMemoryAPI = async function(filename) {
  try {
    const { apiBaseUrl, headers } = window.getApiConfig();
    const response = await fetch(`${apiBaseUrl}/second-me/memory/${filename}`, {
      method: 'DELETE',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete memory: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting memory:', error);
    throw error;
  }
};

window.startTrainingAPI = async function(brainId, trainingData) {
  try {
    const { apiBaseUrl, headers } = window.getApiConfig();
    headers['Content-Type'] = 'application/json';
    
    const response = await fetch(`${apiBaseUrl}/second-me/training/start`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        brainId,
        synthesisMode: trainingData.synthesisMode,
        baseModel: trainingData.baseModel,
        learningRate: trainingData.learningRate,
        epochs: trainingData.epochs,
        threads: trainingData.threads,
        enableGPU: trainingData.enableGPU,
        thinkingModel: trainingData.thinkingModel
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to start training: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error starting training:', error);
    throw error;
  }
};

window.getTrainingStatusAPI = async function(brainId) {
  try {
    const { apiBaseUrl, headers } = window.getApiConfig();
    const response = await fetch(`${apiBaseUrl}/second-me/training/status?brainId=${brainId}`, {
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get training status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting training status:', error);
    return { status: 'error', message: error.message };
  }
};
