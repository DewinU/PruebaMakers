using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Domain.Entities;

public class Prestamo
{
    public Guid id { get; set;}
    public Guid UsuarioId { get; set;}
    public string monto {get; set;}
    public string plazo { get; set; }
    public EstadoPrestamo estado { get; set; }
    public bool isActive { get; set;}
    
    
    private Prestamo()
    {
    }
    
    public static Prestamo Create(Guid usuarioId, string monto, string plazo)
    {
        return new Prestamo
        {
            id = Guid.NewGuid(),
            UsuarioId = usuarioId,
            monto = monto,
            plazo = plazo,
            estado = EstadoPrestamo.Pendiente,
            isActive = true
        };
    }
}