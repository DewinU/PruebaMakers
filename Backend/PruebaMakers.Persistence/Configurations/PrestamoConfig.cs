using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Persistence.Configurations;

public class PrestamoConfig : IEntityTypeConfiguration<Prestamo>
{
    public void Configure(EntityTypeBuilder<Prestamo> builder)
    {
        builder.HasKey(p => p.id);
        builder.Property(p => p.UsuarioId).IsRequired();
        builder.Property(p => p.monto).IsRequired();
        builder.Property(p => p.plazo).IsRequired().HasMaxLength(50);
        builder.Property(p => p.estado).IsRequired();
        builder.Property(p => p.isActive).IsRequired();
    }
}