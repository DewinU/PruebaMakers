using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Application.DTOs.Prestamo;

public class CambiarEstadoPrestamoRequest
{
    public Guid PrestamoId { get; set; }
    public EstadoPrestamo NuevoEstado { get; set; }
}

