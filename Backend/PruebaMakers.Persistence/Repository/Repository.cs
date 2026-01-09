using Microsoft.EntityFrameworkCore;
using PruebaMakers.Application.Contracts.Repositories;

namespace PruebaMakers.Persistence.Repository;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly ApplicationDbContext _context;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task<T?> GetById(Guid id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAll()
    {
        return await _context.Set<T>().ToListAsync();
    }

    public Task<T> Add(T entity)
    {
        _context.Add(entity);
        return Task.FromResult(entity);
    }

    public Task Update(T entity)
    {
        _context.Update(entity);
        return Task.CompletedTask;
    }

    public Task Delete(T entity)
    {
        _context.Remove(entity);
        return Task.CompletedTask;
    }

    public async Task<int> Count()
    {
        return await _context.Set<T>().CountAsync();
    }
}