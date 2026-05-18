<script setup>
import { ref, computed } from 'vue';
import Input from './ui/Input.vue';
import Button from './ui/Button.vue';
import ImageUploader from './ImageUploader.vue';
import { required, isValidEmail, isValidPhone } from '@/utils/validators';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitLabel: {
    type: String,
    default: 'Guardar'
  }
});

const emit = defineEmits(['submit', 'upload-image']);

const formData = ref({
  nombre: props.initialData.nombre || '',
  apellido: props.initialData.apellido || '',
  telefono: props.initialData.telefono || '',
  email: props.initialData.email || '',
  direccion: props.initialData.direccion || '',
  notas: props.initialData.notas || '',
  foto: props.initialData.foto || null
});

const errors = ref({});
const touched = ref({});

const isFormValid = computed(() => {
  return formData.value.nombre.trim() && 
         formData.value.telefono.trim() &&
         !Object.values(errors.value).some(e => e);
});

function validateField(name, value) {
  touched.value[name] = true;
  
  switch(name) {
    case 'nombre':
      return required(value, 'El nombre');
    case 'telefono':
      return required(value, 'El teléfono') || 
             (value && !isValidPhone(value) ? 'Teléfono inválido' : null);
    case 'email':
      return value && !isValidEmail(value) ? 'Email inválido' : null;
    default:
      return null;
  }
}

function onBlur(field) {
  errors.value[field] = validateField(field, formData.value[field]);
}

function onInput(field) {
  if (touched.value[field]) {
    errors.value[field] = validateField(field, formData.value[field]);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  
  // Validar todos los campos
  Object.keys(formData.value).forEach(field => {
    touched.value[field] = true;
    errors.value[field] = validateField(field, formData.value[field]);
  });
  
  // Si hay errores, no enviar
  if (Object.values(errors.value).some(e => e)) {
    // Scroll al primer error
    const firstError = Object.keys(errors.value).find(k => errors.value[k]);
    document.querySelector(`[name="${firstError}"]`)?.focus();
    return;
  }
  
  emit('submit', { ...formData.value });
}

function handleImageUpload({ file, preview }) {
  emit('upload-image', { file, preview, fieldName: 'foto' });
}

function updateImage({ filename, url, fieldName = 'foto' }) {
  formData.value[fieldName] = filename;
  // Actualizar preview si es necesario
}
</script>

<template>
  <form @submit="handleSubmit" class="contact-form" novalidate>
    <div class="form-row">
      <Input
        name="nombre"
        label="Nombre *"
        v-model="formData.nombre"
        :error="touched.nombre && errors.nombre"
        :required="true"
        @blur="onBlur('nombre')"
        @input="onInput('nombre')"
      />
      
      <Input
        name="apellido"
        label="Apellido"
        v-model="formData.apellido"
        @blur="onBlur('apellido')"
      />
    </div>
    
    <Input
      name="telefono"
      label="Teléfono *"
      type="tel"
      v-model="formData.telefono"
      :error="touched.telefono && errors.telefono"
      :required="true"
      placeholder="+52 123 456 7890"
      @blur="onBlur('telefono')"
      @input="onInput('telefono')"
    />
    
    <Input
      name="email"
      label="Email"
      type="email"
      v-model="formData.email"
      :error="touched.email && errors.email"
      placeholder="ejemplo@correo.com"
      @blur="onBlur('email')"
      @input="onInput('email')"
    />
    
    <Input
      name="direccion"
      label="Dirección"
      v-model="formData.direccion"
      placeholder="Calle, número, ciudad..."
    />
    
    <div class="form-group">
      <label class="form-label">Notas</label>
      <textarea
        name="notas"
        v-model="formData.notas"
        class="form-textarea"
        placeholder="Información adicional..."
        rows="3"
      ></textarea>
    </div>
    
    <ImageUploader
      label="Foto del contacto *"
      endpoint="/contactos/crear.php?upload=1"
      v-model="formData.foto"
      :preview-url="initialData.fotoUrl || null"
      @uploaded="handleImageUpload"
    />
    
    <div class="form-actions">
      <Button 
        type="submit" 
        :loading="loading" 
        :disabled="!isFormValid || loading"
        full-width
      >
        {{ submitLabel }}
      </Button>
    </div>
  </form>
</template>

<style scoped>
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-actions {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}
</style>