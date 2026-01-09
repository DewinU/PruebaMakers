export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/Auth/login',
    register: '/api/Auth/register',
  },
  prestamos: {
    solicitar: '/api/Prestamo/solicitar',
    misPrestamos: '/api/Prestamo/mis-prestamos',
    cambiarEstado: '/api/Prestamo/cambiar-estado',
    porUsuario: (usuarioId: string) => `/api/Prestamo/usuario/${usuarioId}`,
  },
} as const;

