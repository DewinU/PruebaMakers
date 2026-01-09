export enum Role {
  Admin = 1,
  User = 2,
}

export enum EstadoPrestamo {
  Aceptado = 1,
  Rechazado = 2,
  Pendiente = 3,
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  usuarioId: string;
  username: string;
  role: string;
}

export interface User {
  usuarioId: string;
  username: string;
  role: string;
}

export interface SolicitarPrestamoRequest {
  monto: string;
  plazo: string;
}

export interface CambiarEstadoPrestamoRequest {
  prestamoId: string;
  nuevoEstado: EstadoPrestamo;
}

export interface PrestamoResponse {
  id: string;
  usuarioId: string;
  monto: string;
  plazo: string;
  estado: EstadoPrestamo;
  isActive: boolean;
}

