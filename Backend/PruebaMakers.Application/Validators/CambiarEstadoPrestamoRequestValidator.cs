using FluentValidation;
using PruebaMakers.Application.DTOs.Prestamo;
using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Application.Validators;

public class CambiarEstadoPrestamoRequestValidator : AbstractValidator<CambiarEstadoPrestamoRequest>
{
    public CambiarEstadoPrestamoRequestValidator()
    {
        RuleFor(x => x.PrestamoId)
            .NotEmpty().WithMessage("El ID del préstamo es requerido");

        RuleFor(x => x.NuevoEstado)
            .IsInEnum().WithMessage("El estado debe ser un valor válido")
            .Must(BeValidEstado).WithMessage("El estado solo puede ser Aceptado o Rechazado");
    }

    private bool BeValidEstado(EstadoPrestamo estado)
    {
        return estado == EstadoPrestamo.Aceptado || estado == EstadoPrestamo.Rechazado;
    }
}

