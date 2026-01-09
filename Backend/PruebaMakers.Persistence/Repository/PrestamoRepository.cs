using Microsoft.EntityFrameworkCore;
using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Persistence.Repository;

public class PrestamoRepository : Repository<Prestamo>, IPrestamoRepository
{
    private readonly ApplicationDbContext _context;
    
    public PrestamoRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Prestamo>> GetPrestamosByUsuarioId(Guid usuarioId)
    {
        return await _context.Prestamos
            .Where(p => p.UsuarioId == usuarioId && p.isActive)
            .ToListAsync();
    }
}