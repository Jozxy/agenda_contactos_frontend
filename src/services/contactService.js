import { apiRequest, uploadRequest } from '@/config/api';

export const contactService = {
  /**
   * Listar contactos del usuario
   * @param {string} token - Token de autorización
   */
  async list(token) {
    return await apiRequest('contactos/index.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  /**
   * Obtener detalle de un contacto
   * @param {string} token - Token de autorización
   * @param {number} id - ID del contacto
   */
  async get(token, id) {
    return await apiRequest('contactos/detalle.php', {
      params: { id },
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  /**
   * Crear nuevo contacto
   * @param {string} token - Token de autorización
   * @param {Object} contactData - Datos del contacto
   */
  async create(token, contactData) {
    return await apiRequest('contactos/crear.php', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: contactData
    });
  },

  /**
   * Actualizar contacto existente
   * @param {string} token - Token de autorización
   * @param {Object} contactData - Datos actualizados (debe incluir id)
   */
  async update(token, contactData) {
    return await apiRequest('contactos/actualizar.php', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: contactData
    });
  },

  /**
   * Eliminar contacto
   * @param {string} token - Token de autorización
   * @param {number} id - ID del contacto a eliminar
   */
  async delete(token, id) {
    return await apiRequest('contactos/eliminar.php', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { id }
    });
  },

  /**
   * Subir imagen de contacto
   * @param {string} token - Token de autorización
   * @param {File} file - Archivo de imagen
   */
  async uploadImage(token, file) {
    const formData = new FormData();
    formData.append('imagen', file);
    
    return await uploadRequest('contactos/crear.php?upload=1', formData, token);
  }
};