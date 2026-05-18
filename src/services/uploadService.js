import { uploadRequest } from '@/config/api';

export const uploadService = {
  /**
   * Sube imagen de perfil de usuario
   * @param {string} token 
   * @param {File} file 
   */
  async uploadUserImage(token, file) {
    const formData = new FormData();
    formData.append('imagen', file);
    return await uploadRequest('auth/editar.php?upload=1', formData, token);
  },

  /**
   * Sube imagen de contacto
   * @param {string} token 
   * @param {File} file 
   */
  async uploadContactImage(token, file) {
    const formData = new FormData();
    formData.append('imagen', file);
    return await uploadRequest('contactos/crear.php?upload=1', formData, token);
  }
};