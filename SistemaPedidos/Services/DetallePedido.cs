using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.Models;

namespace sistemapedidos.Services
{
    public class DetallePedidoService
    {
        private readonly AppDbContext _context;

        public DetallePedidoService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<object>> ObtenerTodosAsync()
        {
            return await _context.DetallePedidos
                .Include(d => d.Plato)
                .Select(d => new
                {
                    d.IdDetalle,
                    d.IdPedido,
                    d.IdPlato,
                    NombrePlato = d.Plato != null ? d.Plato.Nombre : null,
                    d.Cantidad,
                    d.PrecioUnitario,
                    d.Subtotal,
                    d.Observaciones
                })
                .ToListAsync<object>();
        }

        public async Task<object?> ObtenerPorIdAsync(int id)
        {
            return await _context.DetallePedidos
                .Include(d => d.Plato)
                .Where(d => d.IdDetalle == id)
                .Select(d => new
                {
                    d.IdDetalle,
                    d.IdPedido,
                    d.IdPlato,
                    NombrePlato = d.Plato != null ? d.Plato.Nombre : null,
                    d.Cantidad,
                    d.PrecioUnitario,
                    d.Subtotal,
                    d.Observaciones
                })
                .FirstOrDefaultAsync();
        }

        public async Task<object> CrearAsync(DetallePedido detalle)
        {
           
            var pedido = await _context.Pedidos.FindAsync(detalle.IdPedido);
            if (pedido == null)
                throw new InvalidOperationException($"Pedido con ID {detalle.IdPedido} no encontrado.");

            
            var plato = await _context.Platos.FindAsync(detalle.IdPlato);
            if (plato == null)
                throw new InvalidOperationException($"Plato con ID {detalle.IdPlato} no encontrado.");

            
            if (detalle.Cantidad <= 0)
                throw new ArgumentException("La cantidad debe ser mayor que cero.");

            
            if (detalle.PrecioUnitario < 0 || detalle.Subtotal < 0)
                throw new ArgumentException("PrecioUnitario y Subtotal deben ser >= 0.");

            _context.DetallePedidos.Add(detalle);
            await _context.SaveChangesAsync();

            return new
            {
                detalle.IdDetalle,
                detalle.IdPedido,
                detalle.IdPlato,
                NombrePlato = plato.Nombre,
                detalle.Cantidad,
                detalle.PrecioUnitario,
                detalle.Subtotal,
                detalle.Observaciones
            };
        }

        public async Task<bool> ActualizarAsync(int id, DetallePedido detalle)
        {
            var existing = await _context.DetallePedidos.FindAsync(id);
            if (existing == null)
                return false;

           
            var pedido = await _context.Pedidos.FindAsync(detalle.IdPedido);
            if (pedido == null)
                throw new InvalidOperationException($"Pedido con ID {detalle.IdPedido} no encontrado.");

            
            var plato = await _context.Platos.FindAsync(detalle.IdPlato);
            if (plato == null)
                throw new InvalidOperationException($"Plato con ID {detalle.IdPlato} no encontrado.");

            
            if (detalle.Cantidad <= 0)
                throw new ArgumentException("La cantidad debe ser mayor que cero.");

            
            if (detalle.PrecioUnitario < 0 || detalle.Subtotal < 0)
                throw new ArgumentException("PrecioUnitario y Subtotal deben ser >= 0.");

            existing.IdPedido = detalle.IdPedido;
            existing.IdPlato = detalle.IdPlato;
            existing.Cantidad = detalle.Cantidad;
            existing.PrecioUnitario = detalle.PrecioUnitario;
            existing.Subtotal = detalle.Subtotal;
            existing.Observaciones = detalle.Observaciones;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var detalle = await _context.DetallePedidos.FindAsync(id);
            if (detalle == null)
                return false;

            _context.DetallePedidos.Remove(detalle);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}