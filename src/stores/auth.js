import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/authService';
import { handleApiError } from '@/utils/helpers';

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const token = ref(localStorage.getItem('auth_token') || null);
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'));
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userPhoto = computed(() => user.value?.foto || null);

  // Actions
  async function login(credentials) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.token) {
        token.value = response.token;
        user.value = response.usuario;
        
        // Persistir en localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.usuario));
        
        return { success: true, data: response };
      }
      
      error.value = response.message || 'Credenciales inválidas';
      return { success: false, message: error.value };
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al iniciar sesión');
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function register(userData) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        return { success: true, message: response.message };
      }
      
      error.value = response.message || 'Error en el registro';
      return { success: false, message: error.value };
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al registrar usuario');
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function fetchProfile() {
    if (!token.value) return null;
    
    try {
      const response = await authService.getProfile(token.value);
      
      if (response.success && response.usuario) {
        user.value = response.usuario;
        localStorage.setItem('auth_user', JSON.stringify(response.usuario));
        return user.value;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  }

  async function updateProfile(userData) {
    if (!token.value) return { success: false, message: 'No autenticado' };
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await authService.updateProfile(token.value, userData);
      
      if (response.success && response.usuario) {
        user.value = { ...user.value, ...response.usuario };
        localStorage.setItem('auth_user', JSON.stringify(user.value));
        return { success: true, data: user.value };
      }
      
      error.value = response.message || 'Error al actualizar perfil';
      return { success: false, message: error.value };
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al actualizar perfil');
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    if (token.value) {
      try {
        await authService.logout(token.value);
      } catch (err) {
        console.warn('Error en logout del backend:', err);
        // Continuar con logout local aunque falle el backend
      }
    }
    
    // Limpiar estado local
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  function clearError() {
    error.value = null;
  }

  function getAuthHeaders() {
    return token.value 
      ? { 'Authorization': `Bearer ${token.value}` }
      : {};
  }

  return {
    // State
    token,
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userPhoto,
    // Actions
    login,
    register,
    fetchProfile,
    updateProfile,
    logout,
    clearError,
    getAuthHeaders
  };
});