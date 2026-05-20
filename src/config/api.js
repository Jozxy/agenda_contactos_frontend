/**
 * Obtiene la URL base del API desde config.json
 */
export async function getApiUrl() {
  try {
    // Construye la URL correcta considerando GitHub Pages
    const basePath = import.meta.env.BASE_URL || '/';
    const configPath = basePath === '/' 
      ? '/config.json'
      : `${basePath}config.json`;
    
    // URL completa para GitHub Pages
    const configUrl = 'https://agendacompleto.infinityfree.me';
    
    console.log('🔍 Buscando config.json en:', configUrl);
    
    const response = await fetch(configUrl, { 
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const config = await response.json();
    console.log('✅ API_URL cargada:', config.API_URL);
    
    return 'https://agendacompleto.infinityfree.me';
    
  } catch (error) {
    console.error('❌ Error cargando config.json:', error);
    
    return 'https://agendacompleto.infinityfree.me';
  }
}

/**
 * Construye URL completa del API
 */
export async function buildApiUrl(endpoint, params = {}) {
  const baseUrl = await getApiUrl();
  const url = new URL(`${baseUrl}/${endpoint.replace(/^\//, '')}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
}

/**
 * Petición HTTP al API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = await buildApiUrl(endpoint, options.params);
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  delete config.params;
  
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Error en ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Upload con FormData
 */
export async function uploadRequest(endpoint, formData, token) {
  const url = await buildApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Error upload:`, error);
    throw error;
  }
}