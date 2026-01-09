using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Application.Contracts.Repositories;

public interface IUsuarioRepository : IRepository<Usuario>
{
    Task<Usuario?> GetByUsername(string username);
}