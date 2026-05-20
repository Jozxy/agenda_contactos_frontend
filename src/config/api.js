export async function getApiUrl() {
  try {
    const basePath = import.meta.env.BASE_URL || '/';
    // Construir URL completa correctamente
    const configUrl = `${basePath}config.json`.replace(/\/+/g, '/');
    
    console.log('🔍 Buscando config.json en:', configUrl);
    
    const response = await fetch(configUrl, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const config = await response.json();
    
    // ✅ Validar que API_URL existe
    if (!config.API_URL) {
      throw new Error('API_URL no definida en config.json');
    }
    
    console.log('✅ API_URL cargada:', config.API_URL);
    return config.API_URL; // ✅ Retornar el valor real
    
  } catch (error) {
    console.error('❌ Error cargando config.json:', error);
    
    // ✅ Fallback opcional, pero mejor lanzar el error en producción
    const fallback = 'https://agendafull.atwebpages.com';
    console.warn(`⚠️ Usando fallback: ${fallback}`);
    return fallback;
  }
}
