<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import ImageUploader from '@/components/ImageUploader.vue';
import Alert from '@/components/ui/Alert.vue';
import { isValidEmail } from '@/utils/validators';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  email: '',
  foto: null
});

const errors = ref({});
const alert = ref({ show: false, message: '', type: 'success' });
const previewUrl = ref(null);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: '/perfil' } });
    return;
  }
  
  // Cargar datos del perfil
  if (authStore.user) {
    formData.value.email = authStore.user.email || '';
    previewUrl.value = authStore.user.foto 
      ? `/api/uploads/usuarios/${authStore.user.foto}`
      : null;
  }
});

function validate() {
  errors.value = {};
  
  if (formData.value.email && !isValidEmail(formData.value.email)) {
    errors.value.email = 'Formato de email inválido';
  }
  
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  
  const result = await authStore.updateProfile({
    email: formData.value.email,
    foto: formData.value.foto
  });
  
  alert.value = {
    show: true,
    message: result.message,
    type: result.success ? 'success' : 'error'
  };
  
  if (result.success) {
    previewUrl.value = result.data?.foto 
      ? `/api/uploads/usuarios/${result.data.foto}`
      : null;
  }
}

async function handleImageUpload({ file, preview }) {
  // En una implementación completa, subirías la imagen al backend
  // Aquí simulamos la actualización del preview
  previewUrl.value = preview;
  
  // Para producción:
  // const formData = new FormData();
  // formData.append('imagen', file);
  // const response = await fetch('/api/auth/editar.php?upload=1', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${authStore.token}` },
  //   body: formData
  // });
  // const result = await response.json();
  // if (result.success) {
  //   formData.value.foto = result.filename;
  // }
}

function formatDate(dateString) {
  if (!dateString) return 'Fecha no disponible';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function goBack() {
  router.back();
}
</script>

<template>
  <main class="profile-page">
    <div class="container">
      <div class="profile-header">
        <button @click="goBack" class="btn-back">← Volver</button>
        <h1>👤 Mi Perfil</h1>
      </div>
      
      <Alert 
        v-if="alert.show" 
        :type="alert.type"
        dismissible
        v-model="alert.show"
      >
        {{ alert.message }}
      </Alert>
      
      <div class="profile-card card">
        <div class="profile-avatar-section">
          <img 
            v-if="previewUrl" 
            :src="previewUrl" 
            alt="Avatar"
            class="profile-avatar"
            @error="e => e.target.style.display = 'none'"
          >
          <div v-else class="profile-avatar profile-avatar-placeholder">
            {{ authStore.user?.nombre_de_usuario?.charAt(0).toUpperCase() }}
          </div>
          
          <ImageUploader
            label="Cambiar foto"
            endpoint="/auth/editar.php?upload=1"
            v-model="formData.foto"
            :preview-url="previewUrl"
            @uploaded="handleImageUpload"
          />
        </div>
        
        <div class="profile-info">
          <h2 class="profile-username">
            {{ authStore.user?.nombre_de_usuario }}
          </h2>
          <p class="profile-registered">
            Miembro desde: {{ formatDate(authStore.user?.fecha_registro) }}
          </p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="profile-form">
          <Input
            name="email"
            label="Email"
            type="email"
            v-model="formData.email"
            :error="errors.email"
            placeholder="tu@email.com"
          />
          
          <div class="profile-actions">
            <Button 
              type="submit" 
              :loading="authStore.loading"
              :disabled="authStore.loading"
            >
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
      
      <!-- Sección de seguridad -->
      <div class="security-section card mt-4">
        <h3 class="card-title">🔐 Seguridad</h3>
        <p class="text-muted">
          Para cambiar tu contraseña, contacta al administrador o utiliza 
          la opción de recuperación en la pantalla de login.
        </p>
        
        <Button 
          @click="authStore.logout(); router.push('/')" 
          variant="danger"
          class="mt-2"
        >
          🚪 Cerrar sesión en todos los dispositivos
        </Button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.profile-page {
  padding: 2rem 0;
  min-height: calc(100vh - 72px);
}

.profile-header {
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
}

.btn-back:hover {
  color: #4338ca;
}

.profile-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
}

.profile-avatar-section {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 4px solid #4f46e5;
  background: #e2e8f0;
}

.profile-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.profile-info {
  text-align: center;
  margin-bottom: 1.5rem;
}

.profile-username {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.profile-registered {
  color: #64748b;
  font-size: 0.875rem;
}

.profile-form {
  padding-top: 0.5rem;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.security-section {
  max-width: 600px;
  margin: 1.5rem auto 0;
}

.security-section .card-title {
  margin-bottom: 0.5rem;
}
</style>