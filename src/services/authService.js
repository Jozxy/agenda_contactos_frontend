import { apiRequest } from '@/config/api';

export const authService = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - { nombre_de_usuario, password }
   */
  async login(credentials) {
    return await apiRequest('auth/login.php', {
      method: 'POST',
      body: credentials
    });
  },

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario
   */
  async register(userData) {
    return await apiRequest('auth/registrar.php', {
      method: 'POST',
      body: userData
    });
  },

  /**
   * Obtener perfil del usuario autenticado
   * @param {string} token - Token de autorización
   */
  async getProfile(token) {
    return await apiRequest('auth/perfil.php', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  /**
   * Actualizar perfil del usuario
   * @param {string} token - Token de autorización
   * @param {Object} userData - Datos a actualizar
   */
  async updateProfile(token, userData) {
    return await apiRequest('auth/editar.php', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: userData
    });
  },

  /**
   * Cerrar sesión
   * @param {string} token - Token de autorización
   */
  async logout(token) {
    return await apiRequest('auth/logout.php', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};