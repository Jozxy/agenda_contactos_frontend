import { defineStore } from 'pinia';
import { ref } from 'vue';
import { contactService } from '@/services/contactService';
import { useAuthStore } from './auth';
import { handleApiError, getImageUrl } from '@/utils/helpers';

export const useContactsStore = defineStore('contacts', () => {
  // State
  const contacts = ref([]);
  const currentContact = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchContacts() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await contactService.list(authStore.token);
      
      if (response.success && Array.isArray(response.data)) {
        // Procesar URLs de imágenes
        contacts.value = response.data.map(contact => ({
          ...contact,
          fotoUrl: contact.foto ? getImageUrl(contact.foto, 'contactos') : null
        }));
        return contacts.value;
      }
      
      error.value = response.message || 'Error al cargar contactos';
      return [];
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al obtener contactos');
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchContact(id) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return null;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await contactService.get(authStore.token, id);
      
      if (response.success && response.data) {
        currentContact.value = {
          ...response.data,
          fotoUrl: response.data.foto 
            ? getImageUrl(response.data.foto, 'contactos') 
            : null
        };
        return currentContact.value;
      }
      
      error.value = response.message || 'Contacto no encontrado';
      return null;
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al cargar contacto');
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createContact(contactData) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return { success: false };
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await contactService.create(authStore.token, contactData);
      
      if (response.success) {
        // Recargar lista
        await fetchContacts();
        return { success: true, message: response.message, id: response.id };
      }
      
      error.value = response.message || 'Error al crear contacto';
      return { success: false, message: error.value };
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al crear contacto');
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function updateContact(contactData) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return { success: false };
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await contactService.update(authStore.token, contactData);
      
      if (response.success) {
        // Actualizar en lista local
        const index = contacts.value.findIndex(c => c.id === contactData.id);
        if (index !== -1) {
          contacts.value[index] = {
            ...contacts.value[index],
            ...contactData,
            fotoUrl: contactData.foto 
              ? getImageUrl(contactData.foto, 'contactos') 
              : contacts.value[index].fotoUrl
          };
        }
        if (currentContact.value?.id === contactData.id) {
          currentContact.value = contacts.value[index];
        }
        return { success: true, message: response.message };
      }
      
      error.value = response.message || 'Error al actualizar contacto';
      return { success: false, message: error.value };
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al actualizar contacto');
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function deleteContact(id) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return { success: false };
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await contactService.delete(authStore.token, id);
      
      if (response.success) {
        // Eliminar de lista local
        contacts.value = contacts.value.filter(c => c.id !== id);
        if (currentContact.value?.id === id) {
          currentContact.value = null;
        }
        return { success: true, message: response.message };
      }
      
      error.value = response.message || 'Error al eliminar contacto';
      return { success: false, message: error.value };
      
    } catch (err) {
      error.value = handleApiError(err, 'Error al eliminar contacto');
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function uploadContactImage(file) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return null;
    
    try {
      const response = await contactService.uploadImage(authStore.token, file);
      
      if (response.success && response.filename) {
        return {
          filename: response.filename,
          url: getImageUrl(response.filename, 'contactos')
        };
      }
      
      error.value = response.message || 'Error al subir imagen';
      return null;
      
    } catch (err) {
      error.value = handleApiError(err, 'Error en la subida de imagen');
      return null;
    }
  }

  function clearCurrentContact() {
    currentContact.value = null;
  }

  function clearError() {
    error.value = null;
  }

  function searchContacts(query) {
    if (!query) return contacts.value;
    
    const q = query.toLowerCase().trim();
    return contacts.value.filter(c => 
      c.nombre.toLowerCase().includes(q) ||
      c.apellido?.toLowerCase().includes(q) ||
      c.telefono.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }

  return {
    // State
    contacts,
    currentContact,
    loading,
    error,
    // Actions
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    uploadContactImage,
    clearCurrentContact,
    clearError,
    searchContacts
  };
});