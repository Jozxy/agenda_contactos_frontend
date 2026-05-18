<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete']);
const router = useRouter();

function getFullName() {
  const { nombre, apellido } = props.contact;
  return apellido ? `${nombre} ${apellido}` : nombre;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function handleEdit() {
  router.push({ name: 'ContactEdit', params: { id: props.contact.id } });
}

async function handleDelete() {
  if (confirm(`¿Eliminar a ${getFullName()}? Esta acción no se puede deshacer.`)) {
    emit('delete', props.contact.id);
  }
}
</script>

<template>
  <article class="contact-card">
    <div class="contact-image-container">
      <img 
        v-if="contact.fotoUrl" 
        :src="contact.fotoUrl" 
        :alt="getFullName()"
        class="contact-image"
        @error="e => e.target.style.display = 'none'"
      >
      <div v-else class="contact-placeholder">
        👤
      </div>
    </div>
    
    <div class="contact-info">
      <h3 class="contact-name">{{ getFullName() }}</h3>
      
      <div class="contact-detail">
        <span class="contact-detail-icon">📱</span>
        <a :href="`tel:${contact.telefono}`">{{ contact.telefono }}</a>
      </div>
      
      <div v-if="contact.email" class="contact-detail">
        <span class="contact-detail-icon">✉️</span>
        <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      </div>
      
      <div v-if="contact.direccion" class="contact-detail">
        <span class="contact-detail-icon">📍</span>
        <span>{{ contact.direccion }}</span>
      </div>
      
      <p v-if="contact.notas" class="contact-notes">
        {{ contact.notas }}
      </p>
      
      <small class="text-muted">
        Creado: {{ formatDate(contact.fecha_creacion) }}
      </small>
    </div>
    
    <div class="contact-actions">
      <button class="btn btn-outline btn-sm" @click="handleEdit">
        ✏️ Editar
      </button>
      <button class="btn btn-danger btn-sm" @click="handleDelete">
        🗑️ Eliminar
      </button>
    </div>
  </article>
</template>