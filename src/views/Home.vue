<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

function goToAgenda() {
  if (authStore.isAuthenticated) {
    router.push({ name: 'Agenda' });
  } else {
    router.push({ name: 'Login', query: { redirect: '/agenda' } });
  }
}
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="container text-center">
        <h1 class="hero-title">📇 AgendaApp</h1>
        <p class="hero-subtitle">
          Gestiona tus contactos de forma segura y organizada.<br>
          Accede desde cualquier dispositivo.
        </p>
        
        <div class="hero-actions">
          <Button 
            v-if="!authStore.isAuthenticated"
            @click="router.push({ name: 'Register' })"
            size="lg"
          >
            Crear cuenta gratis
          </Button>
          
          <Button 
            @click="goToAgenda"
            variant="outline"
            size="lg"
          >
            {{ authStore.isAuthenticated ? 'Ir a mi agenda' : 'Iniciar sesión' }}
          </Button>
        </div>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2 class="section-title">Características</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🔐</span>
            <h3>Autenticación Segura</h3>
            <p>Tus datos están protegidos con tokens de acceso y encriptación de contraseñas.</p>
          </div>
          
          <div class="feature-card">
            <span class="feature-icon">📱</span>
            <h3>Multi-dispositivo</h3>
            <p>Accede a tus contactos desde cualquier navegador, en cualquier momento.</p>
          </div>
          
          <div class="feature-card">
            <span class="feature-icon">🖼️</span>
            <h3>Fotos de Contacto</h3>
            <p>Sube imágenes para identificar fácilmente a tus contactos importantes.</p>
          </div>
          
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h3>Rápido y Ligero</h3>
            <p>Interfaz optimizada para una experiencia fluida y sin esperas.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  min-height: calc(100vh - 72px);
}

.hero {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.features {
  padding: 4rem 0;
  background: #f8fafc;
}

.section-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1e293b;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.feature-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>