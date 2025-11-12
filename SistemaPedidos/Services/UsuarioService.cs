using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.DTOs;
using sistemapedidos.Models;

namespace sistemapedidos.Services
{
    public class UsuarioService
    {
        private readonly AppDbContext _context;

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UsuarioDTO>> ObtenerTodosAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .Select(u => new UsuarioDTO
                {
                    IdUsuario = u.IdUsuario,
                    Nombre = u.Nombre,
                    Email = u.Email,
                    Rol = u.Rol.NombreRol,
                    Activo = u.Activo,
                    FechaCreacion = u.FechaCreacion
                })
                .ToListAsync();
        }

        public async Task<UsuarioDTO?> ObtenerPorIdAsync(int id)
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .Where(u => u.IdUsuario == id)
                .Select(u => new UsuarioDTO
                {
                    IdUsuario = u.IdUsuario,
                    Nombre = u.Nombre,
                    Email = u.Email,
                    Rol = u.Rol.NombreRol,
                    Activo = u.Activo,
                    FechaCreacion = u.FechaCreacion
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Usuario> CrearAsync(UsuarioDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                throw new ArgumentException("El nombre del usuario es obligatorio.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("El email es obligatorio.");

            var emailExiste = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
            if (emailExiste)
                throw new InvalidOperationException("Ya existe un usuario con ese email.");

            var rol = await _context.Roles.FirstOrDefaultAsync(r => r.NombreRol == dto.Rol);
            if (rol == null)
                throw new InvalidOperationException("Rol no encontrado.");

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                IdRol = rol.IdRol,
                Activo = dto.Activo,
                FechaCreacion = dto.FechaCreacion
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<bool> ActualizarAsync(int id, UsuarioDTO dto)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return false;

            if (string.IsNullOrWhiteSpace(dto.Nombre))
                throw new ArgumentException("El nombre del usuario es obligatorio.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new ArgumentException("El email es obligatorio.");

            var rol = await _context.Roles.FirstOrDefaultAsync(r => r.NombreRol == dto.Rol);
            if (rol == null)
                throw new InvalidOperationException("Rol no encontrado.");

            usuario.Nombre = dto.Nombre;
            usuario.Email = dto.Email;
            usuario.IdRol = rol.IdRol;
            usuario.Activo = dto.Activo;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
                return false;

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}