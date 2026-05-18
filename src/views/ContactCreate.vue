<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useContactsStore } from '@/stores/contacts';
import ContactForm from '@/components/ContactForm.vue';
import Alert from '@/components/ui/Alert.vue';

const router = useRouter();
const authStore = useAuthStore();
const contactsStore = useContactsStore();

const alert = ref({ show: false, message: '', type: 'success' });
const uploadedImage = ref(null);

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: '/agenda/crear' } });
  }
});

async function handleSubmit(contactData) {
  // Incluir imagen subida si existe
  const dataToSend = {
    ...contactData,
    ...(uploadedImage.value && { foto: uploadedImage.value.filename })
  };
  
  const result = await contactsStore.createContact(dataToSend);
  
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
      message: 'Imagen subida correctamente',
      type: 'success'
    };
    setTimeout(() => alert.value.show = false, 2000);
  } else {
    alert.value = {
      show: true,
      message: contactsStore.error || 'Error al subir la imagen',
      type: 'error'
    };
  }
}

function goBack() {
  router.back();
}
</script>

<template>
  <main class="contact-form-page">
    <div class="container">
      <div class="form-header">
        <button @click="goBack" class="btn-back">← Volver</button>
        <h1>➕ Nuevo Contacto</h1>
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
      
      <div class="form-card">
        <ContactForm
          :loading="contactsStore.loading"
          submitLabel="Crear Contacto"
          @submit="handleSubmit"
          @upload-image="handleImageUpload"
        />
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
</style>