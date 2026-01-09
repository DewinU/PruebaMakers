using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using PruebaMakers.Application.Services;
using PruebaMakers.Application.UseCases.Auth;
using PruebaMakers.Application.UseCases.Prestamos;

namespace PruebaMakers.Application;

public static class RegisterApplicationServices
{
    
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(RegisterApplicationServices).Assembly);
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<LoginUseCase>();
        services.AddScoped<RegisterUseCase>();
        services.AddScoped<CrearPrestamosUseCase>();
        services.AddScoped<CambiarEstadoPrestamoUseCase>();
        services.AddScoped<MisPrestamosUseCase>();
        services.AddScoped<ListarPrestamosUseCase>();
    }
    
}