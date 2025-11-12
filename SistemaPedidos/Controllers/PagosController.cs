using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sistemapedidos.Business.Services;
using sistemapedidos.DTOs;

namespace sistemapedidos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class PagosController : ControllerBase
    {
        private readonly PagoService _service;

        public PagosController(PagoService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador,Cajero")]
        public async Task<IActionResult> GetPagos()
        {
            var pagos = await _service.ObtenerTodosAsync();
            return Ok(pagos);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Cajero")]
        public async Task<IActionResult> GetPago(int id)
        {
            var pago = await _service.ObtenerPorIdAsync(id);
            if (pago == null)
                return NotFound(new { message = $"Pago con ID {id} no encontrado." });
            return Ok(pago);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Cajero")]
        public async Task<IActionResult> PostPago(PagoDTO dto)
        {
            try
            {
                var nuevoPago = await _service.CrearAsync(dto);
                return CreatedAtAction(nameof(GetPago), new { id = nuevoPago.IdPago }, nuevoPago);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutPago(int id, PagoDTO dto)
        {
            if (id != dto.IdPago)
                return BadRequest(new { message = "El ID de la URL no coincide con el del pago." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, dto);
                if (!actualizado)
                    return NotFound(new { message = $"Pago con ID {id} no encontrado." });

                return Ok(new { message = "Pago actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeletePago(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Pago con ID {id} no encontrado." });

                return Ok(new { message = "Pago eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}