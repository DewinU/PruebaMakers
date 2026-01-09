using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Application.DTOs.Prestamo;

public class PrestamoResponse
{
    public Guid Id { get; set; }
    public Guid UsuarioId { get; set; }
    public string Monto { get; set; }
    public string Plazo { get; set; }
    public EstadoPrestamo Estado { get; set; }
    public bool IsActive { get; set; }
}

