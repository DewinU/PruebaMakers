using PruebaMakers.Application.Contracts.Persistence;
using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Application.DTOs.Prestamo;
using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Application.UseCases.Prestamos;

public class CambiarEstadoPrestamoUseCase
{
    private readonly IPrestamoRepository _prestamoRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CambiarEstadoPrestamoUseCase(
        IPrestamoRepository prestamoRepository,
        IUsuarioRepository usuarioRepository,
        IUnitOfWork unitOfWork)
    {
        _prestamoRepository = prestamoRepository;
        _usuarioRepository = usuarioRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<PrestamoResponse> Execute(CambiarEstadoPrestamoRequest request, Guid adminUsuarioId)
    {
        var admin = await _usuarioRepository.GetById(adminUsuarioId);
        if (admin == null)
        {
            throw new UnauthorizedAccessException("Usuario no encontrado");
        }

        if (admin.role != Role.Admin)
        {
            throw new UnauthorizedAccessException("Solo los administradores pueden cambiar el estado de los préstamos");
        }

        if (!admin.isActive)
        {
            throw new UnauthorizedAccessException("El usuario administrador no está activo");
        }

        var prestamo = await _prestamoRepository.GetById(request.PrestamoId);
        if (prestamo == null)
        {
            throw new Exception("El préstamo no existe");
        }

        if (!prestamo.isActive)
        {
            throw new Exception("El préstamo no está activo");
        }

        if (request.NuevoEstado != EstadoPrestamo.Aceptado && request.NuevoEstado != EstadoPrestamo.Rechazado)
        {
            throw new Exception("El estado solo puede ser Aceptado o Rechazado");
        }

        if (prestamo.UsuarioId == adminUsuarioId)
        {
            throw new UnauthorizedAccessException("Un administrador no puede aprobar o rechazar su propio préstamo");
        }

        prestamo.estado = request.NuevoEstado;
        await _prestamoRepository.Update(prestamo);
        await _unitOfWork.Commit();

        return new PrestamoResponse
        {
            Id = prestamo.id,
            UsuarioId = prestamo.UsuarioId,
            Monto = prestamo.monto,
            Plazo = prestamo.plazo,
            Estado = prestamo.estado,
            IsActive = prestamo.isActive
        };
    }
}