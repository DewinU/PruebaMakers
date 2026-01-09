using PruebaMakers.Application.Contracts.Persistence;
using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Application.DTOs.Auth;
using PruebaMakers.Application.Services;
using PruebaMakers.Domain.Entities;
using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Application.UseCases.Auth;

public class RegisterUseCase
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public RegisterUseCase(
        IUsuarioRepository usuarioRepository,
        IUnitOfWork unitOfWork,
        IJwtService jwtService)
    {
        _usuarioRepository = usuarioRepository;
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Execute(RegisterRequest request, Guid? usuarioRegistradorId = null)
    {
        if (request.Role == Role.Admin)
        {
            if (usuarioRegistradorId == null)
            {
                throw new UnauthorizedAccessException("Solo los administradores pueden registrar otros administradores");
            }

            var usuarioRegistrador = await _usuarioRepository.GetById(usuarioRegistradorId.Value);
            if (usuarioRegistrador == null)
            {
                throw new UnauthorizedAccessException("Usuario registrador no encontrado");
            }

            if (usuarioRegistrador.role != Role.Admin)
            {
                throw new UnauthorizedAccessException("Solo los administradores pueden registrar otros administradores");
            }

            if (!usuarioRegistrador.isActive)
            {
                throw new UnauthorizedAccessException("El usuario administrador no está activo");
            }
        }

        var usuarioExistente = await _usuarioRepository.GetByUsername(request.Username);
        if (usuarioExistente != null)
        {
            throw new Exception("El nombre de usuario ya está en uso");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var usuario = Usuario.Create(request.Username, passwordHash, request.Role);

        await _usuarioRepository.Add(usuario);
        await _unitOfWork.Commit();

        var token = _jwtService.GenerateToken(usuario);

        return new AuthResponse
        {
            Token = token,
            UsuarioId = usuario.id,
            Username = usuario.username,
            Role = usuario.role.ToString()
        };
    }
}

