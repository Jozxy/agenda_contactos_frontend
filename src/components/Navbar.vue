<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push({ name: 'Login' });
}
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <router-link :to="{ name: 'Home' }" class="nav-logo">
        📇 AgendaApp
      </router-link>
      
      <div class="nav-links">
        <!-- Link Inicio -->
        <router-link :to="{ name: 'Home' }" class="nav-link">
          Inicio
        </router-link>
        
        <!-- Links que requieren auth -->
        <template v-if="authStore.isAuthenticated">
          <router-link :to="{ name: 'Agenda' }" class="nav-link">
            Agenda
          </router-link>
          <router-link :to="{ name: 'Profile' }" class="nav-link">
            Perfil
          </router-link>
          
          <div class="nav-user">
            <span class="nav-username">{{ authStore.user?.nombre_de_usuario || 'Usuario' }}</span>
          </div>
          
          <button @click="handleLogout" class="btn btn-outline btn-sm">
            Salir
          </button>
        </template>
        
        <!-- Links para invitados -->
        <template v-else>
          <router-link :to="{ name: 'Login' }" class="nav-link">
            Iniciar sesión
          </router-link>
          <router-link :to="{ name: 'Register' }" class="btn btn-primary btn-sm">
            Registrarse
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #1e293b;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #4f46e5;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-username {
  font-weight: 500;
  color: #1e293b;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

.btn-outline {
  background: transparent;
  border: 2px solid #4f46e5;
  color: #4f46e5;
}

.btn-outline:hover {
  background: #4f46e5;
  color: white;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>