using FluentValidation;
using PruebaMakers.Application.DTOs.Prestamo;

namespace PruebaMakers.Application.Validators;

public class SolicitarPrestamoRequestValidator : AbstractValidator<SolicitarPrestamoRequest>
{
    public SolicitarPrestamoRequestValidator()
    {
        RuleFor(x => x.Monto)
            .NotEmpty().WithMessage("El monto es requerido")
            .Must(BeValidAmount).WithMessage("El monto debe ser un valor numérico válido mayor a cero");

        RuleFor(x => x.Plazo)
            .NotEmpty().WithMessage("El plazo es requerido")
            .MaximumLength(50).WithMessage("El plazo no puede exceder 50 caracteres");
    }

    private bool BeValidAmount(string monto)
    {
        if (string.IsNullOrWhiteSpace(monto))
            return false;

        if (decimal.TryParse(monto, out decimal valor))
        {
            return valor > 0;
        }

        return false;
    }
}

