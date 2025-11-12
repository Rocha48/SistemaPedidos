using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.Models;

namespace sistemapedidos.Services
{
    public class RolService
    {
        private readonly AppDbContext _context;

        public RolService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Rol>> ObtenerTodosAsync()
        {
            return await _context.Roles.ToListAsync();
        }

        public async Task<Rol?> ObtenerPorIdAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public async Task<Rol> CrearAsync(Rol rol)
        {
            // Validación: nombre del rol no puede estar vacío
            if (string.IsNullOrWhiteSpace(rol.NombreRol))
                throw new ArgumentException("El nombre del rol es obligatorio.");

            // Validación: nombre del rol no puede estar duplicado
            var existe = await _context.Roles.AnyAsync(r => r.NombreRol.ToLower() == rol.NombreRol.ToLower());
            if (existe)
                throw new InvalidOperationException("Ya existe un rol con ese nombre.");

            _context.Roles.Add(rol);
            await _context.SaveChangesAsync();
            return rol;
        }

        public async Task<bool> ActualizarAsync(int id, Rol rol)
        {
            var existing = await _context.Roles.FindAsync(id);
            if (existing == null)
                return false;

            // Validación: nombre del rol no puede estar vacío
            if (string.IsNullOrWhiteSpace(rol.NombreRol))
                throw new ArgumentException("El nombre del rol es obligatorio.");

            existing.NombreRol = rol.NombreRol;
            existing.Descripcion = rol.Descripcion;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var rol = await _context.Roles.FindAsync(id);
            if (rol == null)
                return false;

            // Validación: no se puede eliminar un rol que tiene usuarios asignados
            var tieneUsuarios = await _context.Usuarios.AnyAsync(u => u.IdRol == id);
            if (tieneUsuarios)
                throw new InvalidOperationException("No se puede eliminar un rol que tiene usuarios asignados.");

            _context.Roles.Remove(rol);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}