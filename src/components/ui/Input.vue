<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'blur']);

const classes = computed(() => [
  'form-input',
  props.error && 'error'
]);

function onUpdate(value) {
  emit('update:modelValue', value);
}

function onBlur(event) {
  emit('blur', event);
}
</script>

<template>
  <div class="form-group">
    <label :for="name" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    
    <input
      :id="name"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="classes"
      :disabled="disabled"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${name}-error` : undefined"
      @input="onUpdate($event.target.value)"
      @blur="onBlur"
    >
    
    <span v-if="error" :id="`${name}-error`" class="form-error" role="alert">
      {{ error }}
    </span>
  </div>
</template>