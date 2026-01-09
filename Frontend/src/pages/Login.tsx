import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Role } from '../types';
import toast from 'react-hot-toast';

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export const Login = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
    setError: setFormErrorLogin,
  } = useForm<LoginFormData>();

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister, isSubmitting: isSubmittingRegister },
    setError: setFormErrorRegister,
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: Role.User,
    },
  });

  const password = watch('password');

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard/prestamos', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const onSubmitLogin = async (data: LoginFormData) => {
    try {
      await login({ username: data.username, password: data.password });
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard/prestamos');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setFormErrorLogin('root', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  const onSubmitRegister = async (data: RegisterFormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        setFormErrorRegister('confirmPassword', {
          message: 'Las contraseñas no coinciden',
        });
        return;
      }

      await register({
        username: data.username,
        password: data.password,
        role: data.role,
      });
      toast.success('Registro exitoso');
      navigate('/dashboard/prestamos');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al registrar';
      setFormErrorRegister('root', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PruebaMakers
          </h1>
          <p className="text-gray-600">
            {isRegisterMode
              ? 'Crea una cuenta para continuar'
              : 'Ingresa a tu cuenta para continuar'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {isRegisterMode ? 'Registrarse' : 'Iniciar Sesión'}
          </h2>

          {!isRegisterMode ? (
            <form
              onSubmit={handleSubmitLogin(onSubmitLogin)}
              className="space-y-4"
            >
              {errorsLogin.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorsLogin.root.message}
                </div>
              )}

              <Input
                label="Usuario"
                type="text"
                {...registerLogin('username', {
                  required: 'El usuario es requerido',
                })}
                placeholder="Ingresa tu usuario"
                error={errorsLogin.username?.message}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              />

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                {...registerLogin('password', {
                  required: 'La contraseña es requerida',
                })}
                placeholder="Ingresa tu contraseña"
                error={errorsLogin.password?.message}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                }
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                }
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmittingLogin}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitRegister(onSubmitRegister)}
              className="space-y-4"
            >
              {errorsRegister.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorsRegister.root.message}
                </div>
              )}

              <Input
                label="Usuario"
                type="text"
                {...registerRegister('username', {
                  required: 'El usuario es requerido',
                })}
                placeholder="Ingresa tu usuario"
                error={errorsRegister.username?.message}
              />

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                {...registerRegister('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres',
                  },
                })}
                placeholder="Ingresa tu contraseña"
                error={errorsRegister.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                }
              />

              <Input
                label="Confirmar Contraseña"
                type={showPassword ? 'text' : 'password'}
                {...registerRegister('confirmPassword', {
                  required: 'Confirma tu contraseña',
                  validate: (value) =>
                    value === password || 'Las contraseñas no coinciden',
                })}
                placeholder="Confirma tu contraseña"
                error={errorsRegister.confirmPassword?.message}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmittingRegister}
                className="w-full"
              >
                Registrarse
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
            >
              {isRegisterMode
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

