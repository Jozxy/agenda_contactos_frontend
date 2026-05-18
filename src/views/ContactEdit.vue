<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useContactsStore } from '@/stores/contacts';
import ContactForm from '@/components/ContactForm.vue';
import Alert from '@/components/ui/Alert.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const contactsStore = useContactsStore();

const alert = ref({ show: false, message: '', type: 'success' });
const initialData = ref(null);
const uploadedImage = ref(null);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: `/agenda/${route.params.id}` } });
    return;
  }
  
  const contact = await contactsStore.fetchContact(route.params.id);
  
  if (!contact) {
    alert.value = {
      show: true,
      message: 'Contacto no encontrado',
      type: 'error'
    };
    setTimeout(() => router.push({ name: 'Agenda' }), 2000);
    return;
  }
  
  initialData.value = {
    ...contact,
    fotoUrl: contact.fotoUrl || null
  };
});

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await contactsStore.fetchContact(newId);
  }
});

async function handleSubmit(contactData) {
  const dataToSend = {
    id: route.params.id,
    ...contactData,
    ...(uploadedImage.value && { foto: uploadedImage.value.filename })
  };
  
  const result = await contactsStore.updateContact(dataToSend);
  
  alert.value = {
    show: true,
    message: result.message,
    type: result.success ? 'success' : 'error'
  };
  
  if (result.success) {
    setTimeout(() => {
      router.push({ name: 'Agenda' });
    }, 1500);
  }
}

async function handleImageUpload({ file, preview, fieldName }) {
  const result = await contactsStore.uploadContactImage(file);
  
  if (result?.filename) {
    uploadedImage.value = result;
    alert.value = {
      show: true,
      message: 'Imagen actualizada',
      type: 'success'
    };
    setTimeout(() => alert.value.show = false, 2000);
  } else {
    alert.value = {
      show: true,
      message: contactsStore.error || 'Error al actualizar imagen',
      type: 'error'
    };
  }
}

function goBack() {
  router.back();
}

function handleDelete() {
  if (confirm('¿Eliminar este contacto permanentemente?')) {
    contactsStore.deleteContact(route.params.id).then(result => {
      alert.value = {
        show: true,
        message: result.message,
        type: result.success ? 'success' : 'error'
      };
      if (result.success) {
        setTimeout(() => router.push({ name: 'Agenda' }), 1500);
      }
    });
  }
}
</script>

<template>
  <main class="contact-form-page">
    <div class="container">
      <div class="form-header">
        <button @click="goBack" class="btn-back">← Volver</button>
        <h1>✏️ Editar Contacto</h1>
      </div>
      
      <Alert 
        v-if="alert.show" 
        :type="alert.type"
        dismissible
        v-model="alert.show"
      >
        {{ alert.message }}
      </Alert>
      
      <Alert 
        v-if="contactsStore.error && !alert.show" 
        type="error"
        dismissible
        @update:modelValue="contactsStore.clearError()"
      >
        {{ contactsStore.error }}
      </Alert>
      
      <!-- Estado de carga -->
      <div v-if="contactsStore.loading && !initialData" class="loading">
        <div class="spinner"></div>
        <p>Cargando contacto...</p>
      </div>
      
      <!-- Formulario -->
      <div v-else-if="initialData" class="form-card">
        <ContactForm
          :initial-data="initialData"
          :loading="contactsStore.loading"
          submitLabel="Actualizar Contacto"
          @submit="handleSubmit"
          @upload-image="handleImageUpload"
        />
        
        <div class="form-actions-secondary">
          <button @click="handleDelete" class="btn btn-danger">
            🗑️ Eliminar contacto
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.contact-form-page {
  padding: 2rem 0;
  min-height: calc(100vh - 72px);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-back {
  background: none;
  border: none;
  color: #4f46e5;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #4338ca;
}

.form-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-actions-secondary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.form-actions-secondary .btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.form-actions-secondary .btn:hover {
  color: #dc2626;
  text-decoration: underline;
}
</style>