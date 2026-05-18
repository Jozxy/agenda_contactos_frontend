/**
 * Formatea una fecha a formato legible
 */
export function formatDate(dateString, locale = 'es-ES') {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Sanitiza texto para prevenir XSS (doble encoding)
 */
export function sanitize(text) {
  if (typeof text !== 'string') return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Genera URL absoluta para imágenes del backend
 */
export function getImageUrl(filename, type = 'contactos') {
  if (!filename) return null;
  // La URL base se resuelve desde config.json en runtime
  return `/api/uploads/${type}/${encodeURIComponent(filename)}`;
}

/**
 * Debounce para funciones
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Manejador de errores global para la UI
 */
export function handleApiError(error, fallbackMessage = 'Ocurrió un error inesperado') {
  console.error('API Error:', error);
  
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'No se pudo conectar con el servidor. Verifique su conexión.';
  }
  
  return error.message || fallbackMessage;
}

/**
 * Convierte un objeto FormData a objeto plano (para debugging)
 */
export function formDataToObject(formData) {
  const obj = {};
  for (let [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}