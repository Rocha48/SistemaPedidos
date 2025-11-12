using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.Models;

namespace sistemapedidos.Business.Services
{
    public class MesaService
    {
        private readonly AppDbContext _context;

        public MesaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> ObtenerTodasAsync()
        {
            return await _context.Mesas
                .Select(m => new { m.IdMesa, m.Numero, m.Estado })
                .ToListAsync<object>();
        }

        public async Task<object?> ObtenerPorIdAsync(int id)
        {
            return await _context.Mesas
                .Where(m => m.IdMesa == id)
                .Select(m => new { m.IdMesa, m.Numero, m.Estado })
                .FirstOrDefaultAsync();
        }

        public async Task<Mesa> CrearAsync(Mesa mesa)
        {
          
            var existe = await _context.Mesas.AnyAsync(m => m.Numero == mesa.Numero);
            if (existe)
                throw new InvalidOperationException($"Ya existe una mesa con el número {mesa.Numero}.");

           
            if (mesa.Capacidad <= 0)
                throw new ArgumentException("La capacidad de la mesa debe ser mayor a 0.");

            _context.Mesas.Add(mesa);
            await _context.SaveChangesAsync();
            return mesa;
        }

        public async Task<bool> ActualizarAsync(int id, Mesa mesa)
        {
            var existing = await _context.Mesas.FindAsync(id);
            if (existing == null)
                return false;

            existing.Numero = mesa.Numero;
            existing.Estado = mesa.Estado;
            existing.Capacidad = mesa.Capacidad;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var mesa = await _context.Mesas.FindAsync(id);
            if (mesa == null)
                return false;

            _context.Mesas.Remove(mesa);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}