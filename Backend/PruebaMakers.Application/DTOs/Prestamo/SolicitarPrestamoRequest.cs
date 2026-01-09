namespace PruebaMakers.Application.DTOs.Prestamo;

public class SolicitarPrestamoRequest
{
    public Guid UsuarioId { get; set; }
    public string Monto { get; set; } = string.Empty;
    public string Plazo { get; set; } = string.Empty;
}

