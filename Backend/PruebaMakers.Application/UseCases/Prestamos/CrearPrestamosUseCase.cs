using PruebaMakers.Application.Contracts.Persistence;
using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Application.DTOs;
using PruebaMakers.Application.DTOs.Prestamo;
using PruebaMakers.Domain.Entities;
using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Application.UseCases.Prestamos;

public class CrearPrestamosUseCase
{
    private readonly IPrestamoRepository _prestamoRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CrearPrestamosUseCase(
        IPrestamoRepository prestamoRepository,
        IUsuarioRepository usuarioRepository,
        IUnitOfWork unitOfWork)
    {
        _prestamoRepository = prestamoRepository;
        _usuarioRepository = usuarioRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<PrestamoResponse> Execute(SolicitarPrestamoRequest request)
    {
        var usuario = await _usuarioRepository.GetById(request.UsuarioId);
        if (usuario == null)
        {
            throw new Exception("El usuario no existe");
        }

        if (!usuario.isActive)
        {
            throw new Exception("El usuario no está activo");
        }

        var prestamo = Prestamo.Create(request.UsuarioId, request.Monto, request.Plazo);

        await _prestamoRepository.Add(prestamo);
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