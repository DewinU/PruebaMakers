import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { getAuthToken } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EstadoPrestamo, type PrestamoResponse } from '../types';
import toast from 'react-hot-toast';

interface SearchFormData {
  usuarioId: string;
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

const fetchPrestamosByUsuario = async (
  usuarioId: string,
): Promise<PrestamoResponse[]> => {
  const token = getAuthToken();
  const { data } = await axios.get<PrestamoResponse[]>(
    `${API_BASE_URL}${API_ENDPOINTS.prestamos.porUsuario(usuarioId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const AdminPrestamos = () => {
  const queryClient = useQueryClient();
  const [usuarioId, setUsuarioId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>();

  const { data: prestamos, isLoading, refetch } = useQuery({
    queryKey: ['prestamosPorUsuario', usuarioId],
    queryFn: () => fetchPrestamosByUsuario(usuarioId),
    enabled: !!usuarioId,
  });

  const cambiarEstadoMutation = useMutation({
    mutationFn: async ({
      prestamoId,
      nuevoEstado,
    }: {
      prestamoId: string;
      nuevoEstado: EstadoPrestamo;
    }) => {
      const token = getAuthToken();
      const { data } = await axios.put<PrestamoResponse>(
        `${API_BASE_URL}${API_ENDPOINTS.prestamos.cambiarEstado}`,
        {
          prestamoId,
          nuevoEstado,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestamosPorUsuario'] });
      if (usuarioId) {
        refetch();
      }
      toast.success('Estado del préstamo actualizado');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cambiar el estado');
    },
  });

  const onSubmit = async (data: SearchFormData) => {
    setUsuarioId(data.usuarioId);
  };

  const handleCambiarEstado = (
    prestamoId: string,
    nuevoEstado: EstadoPrestamo,
  ) => {
    cambiarEstadoMutation.mutate({ prestamoId, nuevoEstado });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Administrar Préstamos
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Buscar Préstamos por Usuario
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="ID del Usuario"
            type="text"
            {...register('usuarioId', {
              required: 'El ID del usuario es requerido',
            })}
            placeholder="Ingrese el ID del usuario"
            error={errors.usuarioId?.message}
          />

          <Button type="submit" variant="primary" isLoading={isLoading}>
            Buscar Préstamos
          </Button>
        </form>
      </div>

      {prestamos && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Préstamos del Usuario
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : prestamos.length > 0 ? (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {prestamo.estado === EstadoPrestamo.Pendiente && (
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleCambiarEstado(
                                  prestamo.id,
                                  EstadoPrestamo.Aceptado,
                                )
                              }
                              isLoading={
                                cambiarEstadoMutation.isPending &&
                                cambiarEstadoMutation.variables?.prestamoId ===
                                  prestamo.id &&
                                cambiarEstadoMutation.variables?.nuevoEstado ===
                                  EstadoPrestamo.Aceptado
                              }
                            >
                              Aceptar
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                handleCambiarEstado(
                                  prestamo.id,
                                  EstadoPrestamo.Rechazado,
                                )
                              }
                              isLoading={
                                cambiarEstadoMutation.isPending &&
                                cambiarEstadoMutation.variables?.prestamoId ===
                                  prestamo.id &&
                                cambiarEstadoMutation.variables?.nuevoEstado ===
                                  EstadoPrestamo.Rechazado
                              }
                            >
                              Rechazar
                            </Button>
                          </div>
                        )}
                        {prestamo.estado !== EstadoPrestamo.Pendiente && (
                          <span className="text-gray-400 text-xs">
                            No disponible
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No se encontraron préstamos para este usuario
            </div>
          )}
        </div>
      )}
    </div>
  );
};

