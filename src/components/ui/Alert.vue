<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: v => ['success', 'error', 'warning', 'info'].includes(v)
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const classes = computed(() => `alert alert-${props.type}`);

function dismiss() {
  emit('update:modelValue', false);
}
</script>

<template>
  <Transition name="slide">
    <div v-if="modelValue" :class="classes" role="alert">
      <slot></slot>
      
      <button 
        v-if="dismissible" 
        class="alert-close"
        @click="dismiss"
        aria-label="Cerrar alerta"
      >
        &times;
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.alert {
  position: relative;
  padding-right: 2.5rem;
}

.alert-close {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}
</style>