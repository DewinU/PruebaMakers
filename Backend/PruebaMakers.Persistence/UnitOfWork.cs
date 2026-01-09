using PruebaMakers.Application.Contracts.Persistence;

namespace PruebaMakers.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        
    }
    
    public Task Rollback()
    {
        return Task.CompletedTask;
    }

    public async Task Commit()
    {
        await _context.SaveChangesAsync();
    }
}