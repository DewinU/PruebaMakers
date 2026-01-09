using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PruebaMakers.Application.Contracts.Persistence;
using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Persistence.Repository;

namespace PruebaMakers.Persistence;

public static class RegisterPersistenceServices
{
    public static void AddPersistenceServices(this IServiceCollection services)
    {
        services.AddDbContextPool<ApplicationDbContext>(opt =>
        {
            opt.UseNpgsql("name=ApplicationConnectionString");
        });

        services.AddScoped<IPrestamoRepository, PrestamoRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }
    
}