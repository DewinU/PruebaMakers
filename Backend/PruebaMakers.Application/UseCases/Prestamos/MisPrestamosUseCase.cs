using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Application.DTOs.Prestamo;

namespace PruebaMakers.Application.UseCases.Prestamos;

public class MisPrestamosUseCase
{
    private readonly IPrestamoRepository _prestamoRepository;

    public MisPrestamosUseCase(IPrestamoRepository prestamoRepository)
    {
        _prestamoRepository = prestamoRepository;
    }

    public async Task<IEnumerable<PrestamoResponse>> Execute(Guid usuarioId)
    {
        var prestamos = await _prestamoRepository.GetPrestamosByUsuarioId(usuarioId);

        return prestamos.Select(p => new PrestamoResponse
        {
            Id = p.id,
            UsuarioId = p.UsuarioId,
            Monto = p.monto,
            Plazo = p.plazo,
            Estado = p.estado,
            IsActive = p.isActive
        });
    }
}