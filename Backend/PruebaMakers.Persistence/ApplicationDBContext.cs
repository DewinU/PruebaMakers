using Microsoft.EntityFrameworkCore;
using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {}
    
    protected ApplicationDbContext(){}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
    
    public DbSet<Prestamo> Prestamos { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    
}