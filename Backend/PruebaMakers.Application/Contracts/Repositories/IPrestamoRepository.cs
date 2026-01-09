using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Application.Contracts.Repositories;

public interface IPrestamoRepository : IRepository<Prestamo>
{
    Task<IEnumerable<Prestamo>> GetPrestamosByUsuarioId(Guid usuarioId);
}