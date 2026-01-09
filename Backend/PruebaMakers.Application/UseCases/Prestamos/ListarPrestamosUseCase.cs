using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Application.DTOs.Prestamo;
using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Application.UseCases.Prestamos;

public class ListarPrestamosUseCase
{
    private readonly IPrestamoRepository _prestamoRepository;
    private readonly IUsuarioRepository _usuarioRepository;

    public ListarPrestamosUseCase(
        IPrestamoRepository prestamoRepository,
        IUsuarioRepository usuarioRepository)
    {
        _prestamoRepository = prestamoRepository;
        _usuarioRepository = usuarioRepository;
    }

    public async Task<IEnumerable<PrestamoResponse>> Execute(Guid usuarioId, Guid usuarioSolicitanteId, Role rolUsuarioSolicitante)
    {
        if (rolUsuarioSolicitante != Role.Admin && usuarioId != usuarioSolicitanteId)
        {
            throw new UnauthorizedAccessException("Solo puedes ver tus propios préstamos o debes ser administrador");
        }

        var usuario = await _usuarioRepository.GetById(usuarioId);
        if (usuario == null)
        {
            throw new Exception("El usuario no existe");
        }

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