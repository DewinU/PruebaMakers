import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  PrestamoResponse,
  SolicitarPrestamoRequest,
  CambiarEstadoPrestamoRequest,
} from '../types';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug: Log the request being sent
    if (config.url?.includes('solicitar')) {
      console.log('Axios interceptor - URL:', config.url);
      console.log('Axios interceptor - Method:', config.method);
      console.log('Axios interceptor - Data:', config.data);
      console.log('Axios interceptor - Data type:', typeof config.data);
      console.log('Axios interceptor - Data stringified:', JSON.stringify(config.data));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as any;
      const errorMessage =
        errorData?.error?.message || errorData?.message || 'Request failed';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'An error occurred');
    }
  },
);

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials,
    );
    setAuthToken(data.token);
    return data;
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      request,
    );
    setAuthToken(data.token);
    return data;
  },

  logout: (): void => {
    removeAuthToken();
  },
};

export const prestamosAPI = {
  solicitar: async (
    request: SolicitarPrestamoRequest,
  ): Promise<PrestamoResponse> => {
    console.log('prestamosAPI.solicitar - Request:', request);
    console.log('prestamosAPI.solicitar - Request type:', typeof request);
    console.log('prestamosAPI.solicitar - Request keys:', Object.keys(request || {}));
    
    // Asegurar que el request tenga los datos correctos
    const requestBody = {
      monto: request.monto,
      plazo: request.plazo,
    };
    
    console.log('prestamosAPI.solicitar - Request body:', requestBody);
    console.log('prestamosAPI.solicitar - Request body JSON:', JSON.stringify(requestBody));
    
    const { data } = await axiosInstance.post<PrestamoResponse>(
      API_ENDPOINTS.prestamos.solicitar,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  },

  misPrestamos: async (): Promise<PrestamoResponse[]> => {
    const { data } = await axiosInstance.get<PrestamoResponse[]>(
      API_ENDPOINTS.prestamos.misPrestamos,
    );
    return data;
  },

  cambiarEstado: async (
    request: CambiarEstadoPrestamoRequest,
  ): Promise<PrestamoResponse> => {
    const { data } = await axiosInstance.put<PrestamoResponse>(
      API_ENDPOINTS.prestamos.cambiarEstado,
      request,
    );
    return data;
  },
};

