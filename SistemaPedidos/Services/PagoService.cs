using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.DTOs;
using sistemapedidos.Models;

namespace sistemapedidos.Business.Services
{
    public class PagoService
    {
        private readonly AppDbContext _context;

        public PagoService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PagoDTO>> ObtenerTodosAsync()
        {
            return await _context.Pagos
                .Select(p => new PagoDTO
                {
                    IdPago = p.IdPago,
                    Monto = p.Monto,
                    MetodoPago = p.MetodoPago,
                    FechaPago = p.FechaPago,
                    NumeroTransaccion = p.NumeroTransaccion
                })
                .ToListAsync();
        }

        public async Task<PagoDTO?> ObtenerPorIdAsync(int id)
        {
            return await _context.Pagos
                .Where(p => p.IdPago == id)
                .Select(p => new PagoDTO
                {
                    IdPago = p.IdPago,
                    Monto = p.Monto,
                    MetodoPago = p.MetodoPago,
                    FechaPago = p.FechaPago,
                    NumeroTransaccion = p.NumeroTransaccion
                })
                .FirstOrDefaultAsync();
        }

        public async Task<PagoDTO> CrearAsync(PagoDTO dto)
        {
            // Validación: monto debe ser mayor a 0
            if (dto.Monto <= 0)
                throw new ArgumentException("El monto del pago debe ser mayor a 0.");

            // Validación: método de pago es obligatorio
            if (string.IsNullOrWhiteSpace(dto.MetodoPago))
                throw new ArgumentException("El método de pago es obligatorio.");

            var pago = new Pago
            {
                Monto = dto.Monto,
                MetodoPago = dto.MetodoPago,
                FechaPago = dto.FechaPago,
                NumeroTransaccion = dto.NumeroTransaccion
            };

            _context.Pagos.Add(pago);
            await _context.SaveChangesAsync();

            dto.IdPago = pago.IdPago;
            return dto;
        }

        public async Task<bool> ActualizarAsync(int id, PagoDTO dto)
        {
            var pago = await _context.Pagos.FindAsync(id);
            if (pago == null)
                return false;

            // Validación: monto debe ser mayor a 0
            if (dto.Monto <= 0)
                throw new ArgumentException("El monto del pago debe ser mayor a 0.");

            pago.Monto = dto.Monto;
            pago.MetodoPago = dto.MetodoPago;
            pago.FechaPago = dto.FechaPago;
            pago.NumeroTransaccion = dto.NumeroTransaccion;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var pago = await _context.Pagos.FindAsync(id);
            if (pago == null)
                return false;

            _context.Pagos.Remove(pago);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}