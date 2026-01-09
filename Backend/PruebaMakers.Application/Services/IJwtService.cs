using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Application.Services;

public interface IJwtService
{
    string GenerateToken(Usuario usuario);
}

