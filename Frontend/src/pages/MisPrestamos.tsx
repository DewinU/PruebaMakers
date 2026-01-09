import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { prestamosAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EstadoPrestamo, type SolicitarPrestamoRequest } from '../types';
import toast from 'react-hot-toast';

interface SolicitarPrestamoFormData {
  monto: string;
  plazo: string;
}

const getEstadoLabel = (estado: EstadoPrestamo): string => {
  switch (estado) {
    case EstadoPrestamo.Aceptado:
      return 'Aceptado';
    case EstadoPrestamo.Rechazado:
      return 'Rechazado';
    case EstadoPrestamo.Pendiente:
      return 'Pendiente';
    default:
      return 'Desconocido';
  }
};

const getEstadoColor = (estado: EstadoPrestamo): string => {
  switch (estado) {
    case EstadoPrestamo.Aceptado:
      return 'bg-green-100 text-green-800';
    case EstadoPrestamo.Rechazado:
      return 'bg-red-100 text-red-800';
    case EstadoPrestamo.Pendiente:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const MisPrestamos = () => {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SolicitarPrestamoFormData>({
    defaultValues: {
      monto: '',
      plazo: '',
    },
  });

  const { data: prestamos, isLoading } = useQuery({
    queryKey: ['misPrestamos'],
    queryFn: () => prestamosAPI.misPrestamos(),
  });

  const solicitarMutation = useMutation({
    mutationFn: prestamosAPI.solicitar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['misPrestamos'] });
      toast.success('Préstamo solicitado exitosamente');
      reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al solicitar préstamo');
    },
  });

  const onSubmit = async (data: SolicitarPrestamoFormData) => {
    console.log('Form data:', data);
    
    // Validar que los datos no estén vacíos
    if (!data.monto || !data.plazo) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const requestData: SolicitarPrestamoRequest = {
      monto: String(data.monto).trim(),
      plazo: String(data.plazo).trim(),
    };
    
    console.log('Request data:', requestData);
    console.log('Request data JSON:', JSON.stringify(requestData));
    
    solicitarMutation.mutate(requestData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mis Préstamos</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Solicitar Nuevo Préstamo
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="monto"
              control={control}
              rules={{
                required: 'El monto es requerido',
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: 'Ingrese un monto válido',
                },
              }}
              render={({ field }) => (
                <Input
                  label="Monto"
                  type="text"
                  {...field}
                  placeholder="Ej: 1000.00"
                  error={errors.monto?.message}
                />
              )}
            />

            <Controller
              name="plazo"
              control={control}
              rules={{
                required: 'El plazo es requerido',
              }}
              render={({ field }) => (
                <Input
                  label="Plazo"
                  type="text"
                  {...field}
                  placeholder="Ej: 12 meses"
                  error={errors.plazo?.message}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting || solicitarMutation.isPending}
          >
            Solicitar Préstamo
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Historial de Préstamos
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : prestamos && prestamos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plazo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prestamo.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${prestamo.monto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {prestamo.plazo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(
                          prestamo.estado,
                        )}`}
                      >
                        {getEstadoLabel(prestamo.estado)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No tienes préstamos registrados
          </div>
        )}
      </div>
    </div>
  );
};

