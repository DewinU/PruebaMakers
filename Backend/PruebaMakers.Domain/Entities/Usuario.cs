using PruebaMakers.Domain.Enums;

namespace PruebaMakers.Domain.Entities;

public class Usuario
{
    public Guid id { get; set;}
    public string username { get; set;}
    public string password { get; set;}
    public Role role { get; set;}
    public bool isActive { get; set;}
    public List<Prestamo> prestamos { get; set;}
    
    private Usuario()
    {
    }

    public static Usuario Create(string username, string passwordHash, Role role)
    {
        return new Usuario
        {
            id = Guid.NewGuid(),
            username = username,
            password = passwordHash,
            role = role,
            isActive = true,
            prestamos = new List<Prestamo>()
        };
    }
}