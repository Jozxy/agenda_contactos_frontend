<script setup>
import { ref, computed, watch } from 'vue';
import { isValidImage } from '@/utils/validators';

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: 'Imagen'
  },
  endpoint: {
    type: String,
    required: true
  },
  previewUrl: {
    type: String,
    default: null
  },
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/webp'
  },
  maxSizeMB: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:modelValue', 'uploading', 'uploaded', 'error']);

const fileInput = ref(null);
const uploading = ref(false);
const localPreview = ref(props.previewUrl);
const errorMessage = ref(null);

const showPreview = computed(() => localPreview.value || props.modelValue);

watch(() => props.previewUrl, (newUrl) => {
  if (newUrl) localPreview.value = newUrl;
});

async function handleFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  
  // Validar archivo
  const validation = isValidImage(file, props.maxSizeMB);
  if (!validation.valid) {
    errorMessage.value = validation.error;
    emit('error', validation.error);
    if (fileInput.value) fileInput.value.value = '';
    return;
  }
  
  errorMessage.value = null;
  uploading.value = true;
  emit('uploading', true);
  
  // Crear preview local
  const reader = new FileReader();
  reader.onload = (e) => {
    localPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  
  // Emitir evento para que el padre maneje la subida
  emit('uploaded', { file, preview: localPreview.value });
  
  // Resetear input
  if (fileInput.value) fileInput.value.value = '';
  uploading.value = false;
}

function removeImage() {
  emit('update:modelValue', null);
  localPreview.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

function triggerFileInput() {
  fileInput.value?.click();
}
</script>

<template>
  <div class="image-uploader">
    <label class="form-label">{{ label }}</label>
    
    <div 
      class="image-preview" 
      @click="triggerFileInput"
      :class="{ 'has-image': showPreview }"
      role="button"
      tabindex="0"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
    >
      <img 
        v-if="showPreview" 
        :src="showPreview" 
        alt="Vista previa"
        class="preview-image"
      >
      
      <div v-else class="image-placeholder">
        <span class="image-placeholder-icon">📷</span>
        <span>Haga clic para subir</span>
        <span class="text-muted" style="font-size: 0.75rem">
          JPG, PNG o WEBP (máx. {{ maxSizeMB }}MB)
        </span>
      </div>
      
      <button 
        v-if="showPreview" 
        type="button"
        class="image-remove"
        @click.stop="removeImage"
        aria-label="Eliminar imagen"
      >
        ×
      </button>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      class="image-input"
      :accept="accept"
      @change="handleFileSelect"
      :disabled="uploading"
    >
    
    <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
    <p v-if="uploading" class="text-muted">Subiendo imagen...</p>
  </div>
</template>

<style scoped>
.image-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
  overflow: hidden;
}

.image-preview:hover,
.image-preview:focus {
  border-color: #4f46e5;
  background: #f1f5f9;
  outline: none;
}

.image-preview.has-image {
  border-style: solid;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  text-align: center;
  padding: 1rem;
}

.image-placeholder-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.image-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  z-index: 1;
}

.image-remove:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.image-input {
  display: none;
}
</style>