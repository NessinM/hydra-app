export const va_required = (v) => !!v || 'es requerido'
export const va_minLength = (number) => (v) => (v || '').length >= number || `debe tener más de ${number} caracteres`
export const va_maxLength = (number) => (v) => (v || '').length <= number || `debe tener menos de ${number} caracteres`
export const va_email = (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'no es un correo valido'
