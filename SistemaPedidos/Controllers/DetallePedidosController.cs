using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sistemapedidos.Models;
using sistemapedidos.Services;

namespace sistemapedidos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class DetallePedidosController : ControllerBase
    {
        private readonly DetallePedidoService _service;

        public DetallePedidosController(DetallePedidoService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador,Cajero,Cocina,Mozo")]
        public async Task<IActionResult> GetDetalles()
        {
            var detalles = await _service.ObtenerTodosAsync();
            return Ok(detalles);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Cajero,Cocina,Mozo")]
        public async Task<IActionResult> GetDetalle(int id)
        {
            var detalle = await _service.ObtenerPorIdAsync(id);
            if (detalle == null)
                return NotFound(new { message = $"Detalle con ID {id} no encontrado." });
            return Ok(detalle);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Mozo")]
        public async Task<IActionResult> PostDetalle([FromBody] DetallePedido detalle)
        {
            try
            {
                var response = await _service.CrearAsync(detalle);
                return CreatedAtAction(nameof(GetDetalle), new { id = detalle.IdDetalle }, response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,Mozo")]
        public async Task<IActionResult> PutDetalle(int id, [FromBody] DetallePedido detalle)
        {
            if (id != detalle.IdDetalle)
                return BadRequest(new { message = "El ID de la URL no coincide con IdDetalle en el cuerpo." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, detalle);
                if (!actualizado)
                    return NotFound(new { message = $"Detalle con ID {id} no encontrado." });

                return Ok(new { message = "Detalle actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteDetalle(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Detalle con ID {id} no encontrado." });

                return Ok(new { message = "Detalle eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}