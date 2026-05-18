<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useContactsStore } from '@/stores/contacts';
import ContactCard from '@/components/ContactCard.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Alert from '@/components/ui/Alert.vue';

const router = useRouter();
const authStore = useAuthStore();
const contactsStore = useContactsStore();

const searchQuery = ref('');
const alert = ref({ show: false, message: '', type: 'success' });

const filteredContacts = computed(() => {
  if (!searchQuery.value.trim()) return contactsStore.contacts;
  
  const query = searchQuery.value.toLowerCase();
  return contactsStore.contacts.filter(c => 
    c.nombre.toLowerCase().includes(query) ||
    c.apellido?.toLowerCase().includes(query) ||
    c.telefono.includes(query) ||
    c.email?.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: '/agenda' } });
    return;
  }
  
  await contactsStore.fetchContacts();
});

async function handleDeleteContact(id) {
  const result = await contactsStore.deleteContact(id);
  
  alert.value = {
    show: true,
    message: result.message,
    type: result.success ? 'success' : 'error'
  };
  
  setTimeout(() => {
    alert.value.show = false;
  }, 3000);
}

function goToCreate() {
  router.push({ name: 'ContactCreate' });
}

function refreshContacts() {
  contactsStore.fetchContacts();
}
</script>

<template>
  <main class="agenda-page">
    <div class="container">
      <!-- Header -->
      <div class="agenda-header">
        <div>
          <h1>📇 Mi Agenda</h1>
          <p class="text-muted">
            {{ contactsStore.contacts.length }} contacto{{ contactsStore.contacts.length !== 1 ? 's' : '' }}
          </p>
        </div>
        
        <Button @click="goToCreate" variant="primary">
          ➕ Nuevo Contacto
        </Button>
      </div>
      
      <!-- Alertas -->
      <Alert 
        v-if="alert.show" 
        :type="alert.type"
        dismissible
        v-model="alert.show"
      >
        {{ alert.message }}
      </Alert>
      
      <Alert 
        v-if="contactsStore.error" 
        type="error"
        dismissible
        @update:modelValue="contactsStore.clearError()"
      >
        {{ contactsStore.error }}
      </Alert>
      
      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <Input
          name="search"
          label=""
          v-model="searchQuery"
          placeholder="🔍 Buscar por nombre, teléfono o email..."
          type="search"
        />
        <button 
          v-if="searchQuery" 
          class="search-clear"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>
      
      <!-- Estado de carga -->
      <div v-if="contactsStore.loading && !contactsStore.contacts.length" class="loading">
        <div class="spinner"></div>
        <p>Cargando contactos...</p>
      </div>
      
      <!-- Lista vacía -->
      <div v-else-if="!contactsStore.loading && !filteredContacts.length" class="empty-state">
        <div class="empty-state-icon">📭</div>
        <h3>
          {{ searchQuery ? 'No se encontraron resultados' : 'Tu agenda está vacía' }}
        </h3>
        <p v-if="!searchQuery">
          Comienza agregando tu primer contacto
        </p>
        <Button @click="goToCreate" variant="outline" class="mt-4">
          Agregar contacto
        </Button>
      </div>
      
      <!-- Grid de contactos -->
      <div v-else class="contacts-grid">
        <ContactCard
          v-for="contact in filteredContacts"
          :key="contact.id"
          :contact="contact"
          @delete="handleDeleteContact"
        />
      </div>
      
      <!-- Botón de recargar -->
      <div v-if="contactsStore.contacts.length" class="agenda-footer">
        <Button @click="refreshContacts" variant="outline" size="sm">
          🔄 Actualizar
        </Button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.agenda-page {
  padding: 2rem 0;
  min-height: calc(100vh - 72px);
}

.agenda-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.agenda-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

.search-bar {
  position: relative;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

.search-bar :deep(.form-input) {
  padding-right: 2.5rem;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25rem;
}

.search-clear:hover {
  color: #1e293b;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-state-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.agenda-footer {
  text-align: center;
  padding-top: 2rem;
}

@media (max-width: 640px) {
  .agenda-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .agenda-header .btn {
    width: 100%;
  }
}
</style>