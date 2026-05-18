/**
 * Validador de email
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validador de teléfono (formato internacional básico)
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  // Permite: +, números, espacios, guiones, paréntesis
  return /^[\d\s\-\+\(\)]{7,20}$/.test(phone);
}

/**
 * Validador de contraseña segura
 */
export function isStrongPassword(password) {
  if (!password) return false;
  // Mínimo 6 caracteres, al menos una letra y un número
  return password.length >= 6 && 
         /[a-zA-Z]/.test(password) && 
         /\d/.test(password);
}

/**
 * Validador de nombre de usuario
 */
export function isValidUsername(username) {
  if (!username) return false;
  // 3-50 caracteres, solo letras, números, guiones y guiones bajos
  return /^[a-zA-Z0-9_-]{3,50}$/.test(username);
}

/**
 * Validador de archivo de imagen
 */
export function isValidImage(file, maxSizeMB = 5) {
  if (!file) return { valid: false, error: 'No se seleccionó ningún archivo' };
  
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Formato no permitido. Use JPG, PNG o WEBP' };
  }
  
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `El archivo debe pesar menos de ${maxSizeMB}MB` };
  }
  
  return { valid: true };
}

/**
 * Genera mensajes de error para campos requeridos
 */
export function required(value, fieldName = 'Este campo') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} es requerido`;
  }
  return null;
}

/**
 * Genera mensajes de error personalizados
 */
export function createValidator(rules) {
  return function validate(value, fieldName) {
    for (const rule of rules) {
      const error = rule(value, fieldName);
      if (error) return error;
    }
    return null;
  };
}