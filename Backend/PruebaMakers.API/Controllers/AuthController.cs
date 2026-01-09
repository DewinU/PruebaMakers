using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using PruebaMakers.Application.DTOs.Auth;
using PruebaMakers.Application.UseCases.Auth;
using PruebaMakers.Domain.Enums;

namespace PruebaMakers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly LoginUseCase _loginUseCase;
    private readonly RegisterUseCase _registerUseCase;

    public AuthController(LoginUseCase loginUseCase, RegisterUseCase registerUseCase)
    {
        _loginUseCase = loginUseCase;
        _registerUseCase = registerUseCase;
    }

    /// <summary>
    /// Registrar un nuevo usuario (requiere autenticación como Admin si se registra como Admin)
    /// </summary>
    /// <param name="request">Datos del usuario a registrar</param>
    /// <returns>Token JWT y datos del usuario</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            Guid? usuarioRegistradorId = null;
            if (request.Role == Role.Admin)
            {
                if (!User.Identity?.IsAuthenticated ?? true)
                {
                    return Unauthorized(new { message = "Se requiere autenticación para registrar un administrador" });
                }

                var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(usuarioIdClaim) || !Guid.TryParse(usuarioIdClaim, out var usuarioId))
                {
                    return Unauthorized(new { message = "Token inválido" });
                }

                var rolClaim = User.FindFirst(ClaimTypes.Role)?.Value;
                if (rolClaim != "Admin")
                {
                    return Unauthorized(new { message = "Solo los administradores pueden registrar otros administradores" });
                }

                usuarioRegistradorId = usuarioId;
            }

            var response = await _registerUseCase.Execute(request, usuarioRegistradorId);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Iniciar sesión
    /// </summary>
    /// <param name="request">Credenciales de acceso</param>
    /// <returns>Token JWT y datos del usuario</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _loginUseCase.Execute(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}

