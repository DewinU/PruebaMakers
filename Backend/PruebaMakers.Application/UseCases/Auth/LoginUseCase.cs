using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Application.DTOs.Auth;
using PruebaMakers.Application.Services;

namespace PruebaMakers.Application.UseCases.Auth;

public class LoginUseCase
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IJwtService _jwtService;

    public LoginUseCase(IUsuarioRepository usuarioRepository, IJwtService jwtService)
    {
        _usuarioRepository = usuarioRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Execute(LoginRequest request)
    {
        var usuario = await _usuarioRepository.GetByUsername(request.Username);
        
        if (usuario == null)
        {
            throw new Exception("Usuario o contraseña incorrectos");
        }

        if (!usuario.isActive)
        {
            throw new Exception("El usuario no está activo");
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.password))
        {
            throw new Exception("Usuario o contraseña incorrectos");
        }

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

