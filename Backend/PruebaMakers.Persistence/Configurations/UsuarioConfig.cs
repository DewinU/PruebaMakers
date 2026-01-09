using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PruebaMakers.Domain.Entities;

namespace PruebaMakers.Persistence.Configurations;

public class UsuarioConfig : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.HasKey(u => u.id);
        builder.Property(u => u.username).IsRequired().HasMaxLength(50);
        builder.Property(u => u.password).IsRequired().HasMaxLength(100);
        builder.Property(u => u.role).IsRequired();
        builder.Property(u => u.isActive).IsRequired();

        builder.HasMany(u => u.prestamos)
            .WithOne()
            .HasForeignKey("UsuarioId")
            .OnDelete(DeleteBehavior.Cascade);
    }
}