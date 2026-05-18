/**
 * Obtiene la URL base del API desde config.json
 * @returns {Promise<string>} URL del API
 */
export async function getApiUrl() {
  try {
    const response = await fetch('/config.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const config = await response.json();
    if (!config.API_URL) {
      throw new Error('API_URL no definida en config.json');
    }
    return config.API_URL.replace(/\/$/, ''); // Eliminar slash final
  } catch (error) {
    console.error('❌ Error cargando configuración del API:', error);
    // Fallback para desarrollo local
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  }
}

/**
 * Construye una URL completa para el endpoint
 * @param {string} endpoint - Ruta relativa del endpoint
 * @param {Object} params - Parámetros query opcionales
 * @returns {Promise<string>} URL completa
 */
export async function buildApiUrl(endpoint, params = {}) {
  const baseUrl = await getApiUrl();
  const url = new URL(`${baseUrl}/${endpoint.replace(/^\//, '')}`);
  
  // Agregar parámetros query si existen
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
}

/**
 * Realiza una petición HTTP al API
 * @param {string} endpoint - Endpoint relativo
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<Object>} Respuesta parseada como JSON
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
  
  // Eliminar params de config para fetch
  delete config.params;
  
  // Agregar body si es POST/PUT y hay datos
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
    console.error(`❌ Error en ${config.method} ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Realiza una petición con FormData (para uploads)
 * @param {string} endpoint - Endpoint relativo
 * @param {FormData} formData - Datos del formulario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta parseada
 */
export async function uploadRequest(endpoint, formData, token) {
  const url = await buildApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // NO establecer Content-Type para FormData
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Error upload en ${endpoint}:`, error);
    throw error;
  }
}