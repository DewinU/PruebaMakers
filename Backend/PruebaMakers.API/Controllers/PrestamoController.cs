using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PruebaMakers.Application.DTOs.Prestamo;
using PruebaMakers.Application.UseCases.Prestamos;
using PruebaMakers.Domain.Enums;

namespace PruebaMakers.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PrestamoController : ControllerBase
{
    private readonly CrearPrestamosUseCase _crearPrestamosUseCase;
    private readonly CambiarEstadoPrestamoUseCase _cambiarEstadoPrestamoUseCase;
    private readonly MisPrestamosUseCase _misPrestamosUseCase;
    private readonly ListarPrestamosUseCase _listarPrestamosUseCase;

    public PrestamoController(
        CrearPrestamosUseCase crearPrestamosUseCase,
        CambiarEstadoPrestamoUseCase cambiarEstadoPrestamoUseCase,
        MisPrestamosUseCase misPrestamosUseCase,
        ListarPrestamosUseCase listarPrestamosUseCase)
    {
        _crearPrestamosUseCase = crearPrestamosUseCase;
        _cambiarEstadoPrestamoUseCase = cambiarEstadoPrestamoUseCase;
        _misPrestamosUseCase = misPrestamosUseCase;
        _listarPrestamosUseCase = listarPrestamosUseCase;
    }

    /// <summary>
    /// Solicitar un préstamo
    /// </summary>
    /// <param name="request">Datos del préstamo a solicitar</param>
    /// <returns>Préstamo creado con estado Pendiente</returns>
    [HttpPost("solicitar")]
    [Authorize(Roles = "User,Admin")]
    [ProducesResponseType(typeof(PrestamoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> SolicitarPrestamo([FromBody] SolicitarPrestamoRequest request)
    {
        try
        {
            var usuarioId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            request.UsuarioId = usuarioId;
            var prestamo = await _crearPrestamosUseCase.Execute(request);
            return Ok(prestamo);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Aprobar o rechazar un préstamo (solo administradores)
    /// </summary>
    /// <param name="request">Datos para cambiar el estado del préstamo</param>
    /// <returns>Préstamo actualizado</returns>
    [HttpPut("cambiar-estado")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(PrestamoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CambiarEstadoPrestamo([FromBody] CambiarEstadoPrestamoRequest request)
    {
        try
        {
            var adminUsuarioId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var prestamo = await _cambiarEstadoPrestamoUseCase.Execute(request, adminUsuarioId);
            return Ok(prestamo);
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
    /// Ver estado de los préstamos del usuario autenticado
    /// </summary>
    /// <returns>Lista de préstamos del usuario</returns>
    [HttpGet("mis-prestamos")]
    [Authorize(Roles = "User,Admin")]
    [ProducesResponseType(typeof(IEnumerable<PrestamoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ListarMisPrestamos()
    {
        try
        {
            var usuarioId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var prestamos = await _misPrestamosUseCase.Execute(usuarioId);
            return Ok(prestamos);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Listar todos los préstamos de un usuario (Admins pueden ver cualquier usuario, usuarios normales solo los suyos)
    /// </summary>
    /// <param name="usuarioId">ID del usuario cuyos préstamos se desean listar</param>
    /// <returns>Lista de préstamos del usuario</returns>
    [HttpGet("usuario/{usuarioId}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<PrestamoResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ListarPrestamosPorUsuario(Guid usuarioId)
    {
        try
        {
            var usuarioSolicitanteId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var rolClaim = User.FindFirst(ClaimTypes.Role)!.Value;
            var rolUsuarioSolicitante = Enum.Parse<Role>(rolClaim);

            var prestamos = await _listarPrestamosUseCase.Execute(usuarioId, usuarioSolicitanteId, rolUsuarioSolicitante);
            return Ok(prestamos);
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
}