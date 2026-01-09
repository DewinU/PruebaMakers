using Microsoft.EntityFrameworkCore;
using PruebaMakers.Application.Contracts.Repositories;
using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Persistence.Repository;

public class UsuarioRepository : Repository<Usuario>, IUsuarioRepository
{
    private readonly ApplicationDbContext _context;
    
    public UsuarioRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }
    
    public async Task<Usuario?> GetByUsername(string username)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.username == username);
    }
}