using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.DTOs;
using sistemapedidos.Models;

namespace sistemapedidos.Services
{
    public class PedidoService
    {
        private readonly AppDbContext _context;

        public PedidoService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PedidoDTO>> ObtenerTodosAsync()
        {
            return await _context.Pedidos
                .Select(p => new PedidoDTO
                {
                    IdPedido = p.IdPedido,
                    FechaHora = p.FechaHora,
                    Total = p.Total,
                    Estado = p.Estado
                })
                .ToListAsync();
        }

        public async Task<PedidoDTO?> ObtenerPorIdAsync(int id)
        {
            return await _context.Pedidos
                .Where(p => p.IdPedido == id)
                .Select(p => new PedidoDTO
                {
                    IdPedido = p.IdPedido,
                    FechaHora = p.FechaHora,
                    Total = p.Total,
                    Estado = p.Estado
                })
                .FirstOrDefaultAsync();
        }

        public async Task<Pedido> CrearAsync(Pedido pedido)
        {
            if (pedido.Total < 0)
                throw new ArgumentException("El total no puede ser negativo.");

        
            if (string.IsNullOrWhiteSpace(pedido.NombreCliente))
                throw new ArgumentException("El nombre del cliente es obligatorio.");

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();
            return pedido;
        }

        public async Task<bool> ActualizarAsync(int id, Pedido pedido)
        {
            var existing = await _context.Pedidos.FindAsync(id);
            if (existing == null)
                return false;

            
            if (pedido.Total < 0)
                throw new ArgumentException("El total no puede ser negativo.");

            existing.Estado = pedido.Estado;
            existing.Total = pedido.Total;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
                return false;

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}