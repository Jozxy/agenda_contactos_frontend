import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Views
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Agenda from '@/views/Agenda.vue';
import ContactCreate from '@/views/ContactCreate.vue';
import ContactEdit from '@/views/ContactEdit.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: false } },
  { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false, guestOnly: true } },
  { path: '/registro', name: 'Register', component: Register, meta: { requiresAuth: false, guestOnly: true } },
  { path: '/agenda', name: 'Agenda', component: Agenda, meta: { requiresAuth: true } },
  { path: '/agenda/crear', name: 'ContactCreate', component: ContactCreate, meta: { requiresAuth: true } },
  { path: '/agenda/:id', name: 'ContactEdit', component: ContactEdit, props: true, meta: { requiresAuth: true } },
  { path: '/perfil', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

// ⚠️ AQUÍ ESTABA EL ERROR: Faltaba pasar el arreglo 'routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // ✅ ESTA LÍNEA ES LA QUE ARREGLA EL ERROR
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  }
});

// Guard de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Si requiere autenticación y no está logueado → ir a Login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }
  
  // Si requiere autenticación, cargar perfil si está vacío
  if (to.meta.requiresAuth && !authStore.user) {
    await authStore.fetchProfile();
  }
  
  // Si ya está logueado, redirigir de login/registro a Agenda
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'Agenda' });
  }
  
  next();
});

export default router;