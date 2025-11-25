using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.DTOs;
using sistemapedidos.Models;

namespace sistemapedidos.Services
{
    public class PlatoService
    {
        private readonly AppDbContext _context;

        public PlatoService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PlatoDTO>> ObtenerTodosAsync()
        {
            return await _context.Platos
                .Include(p => p.Categoria)
                .Select(p => new PlatoDTO
                {
                    IdPlato = p.IdPlato,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    Precio = p.Precio,
                    Categoria = p.Categoria.Nombre,
                    ImagenURL = p.ImagenURL,
                    Disponible = p.Disponible
                })
                .ToListAsync();
        }

        public async Task<PlatoDTO?> ObtenerPorIdAsync(int id)
        {
            return await _context.Platos
                .AsNoTracking()
                .Include(p => p.Categoria)
                .Where(p => p.IdPlato == id)
                .Select(p => new PlatoDTO
                {
                    IdPlato = p.IdPlato,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    Precio = p.Precio,
                    Categoria = p.Categoria.Nombre,
                    ImagenURL = p.ImagenURL,
                    Disponible = p.Disponible
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Plato> CrearAsync(PlatoDTO dto)
        {
            
            if (dto.Precio <= 0)
                throw new ArgumentException("El precio debe ser mayor a 0.");

            if (string.IsNullOrWhiteSpace(dto.Nombre))
                throw new ArgumentException("El nombre del plato es obligatorio.");

            var categoria = await _context.CategoriasPlato
                .FirstOrDefaultAsync(c => c.Nombre == dto.Categoria);

            if (categoria == null)
                throw new InvalidOperationException("Categoría no encontrada.");

            var plato = new Plato
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Precio = dto.Precio,
                IdCategoria = categoria.IdCategoria,
                ImagenURL = dto.ImagenURL,
                Disponible = dto.Disponible,
                FechaCreacion = DateTime.Now
            };

            _context.Platos.Add(plato);
            await _context.SaveChangesAsync();
            return plato;
        }

        public async Task<bool> ActualizarAsync(int id, PlatoDTO dto)
        {
            var plato = await _context.Platos.FindAsync(id);
            if (plato == null)
                return false;

            // Validación: precio debe ser mayor a 0
            if (dto.Precio <= 0)
                throw new ArgumentException("El precio debe ser mayor a 0.");

            var categoria = await _context.CategoriasPlato
                .FirstOrDefaultAsync(c => c.Nombre == dto.Categoria);

            if (categoria == null)
                throw new InvalidOperationException("Categoría no encontrada.");

            plato.Nombre = dto.Nombre;
            plato.Descripcion = dto.Descripcion;
            plato.Precio = dto.Precio;
            plato.IdCategoria = categoria.IdCategoria;
            plato.ImagenURL = dto.ImagenURL;
            plato.Disponible = dto.Disponible;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var plato = await _context.Platos.FindAsync(id);
            if (plato == null)
                return false;

            // Validación: no se puede eliminar si tiene detalles de pedido
            var tieneDetalles = await _context.DetallePedidos.AnyAsync(d => d.IdPlato == id);
            if (tieneDetalles)
                throw new InvalidOperationException("No se puede eliminar un plato que está en pedidos.");

            _context.Platos.Remove(plato);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}