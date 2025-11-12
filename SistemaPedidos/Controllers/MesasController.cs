using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sistemapedidos.Business.Services;
using sistemapedidos.Models;

namespace sistemapedidos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class MesasController : ControllerBase
    {
        private readonly MesaService _service;

        public MesasController(MesaService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador,Mozo")]
        public async Task<IActionResult> GetMesas()
        {
            var mesas = await _service.ObtenerTodasAsync();
            return Ok(mesas);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Mozo")]
        public async Task<IActionResult> GetMesa(int id)
        {
            var mesa = await _service.ObtenerPorIdAsync(id);
            if (mesa == null)
                return NotFound(new { message = $"Mesa con ID {id} no encontrada." });
            return Ok(mesa);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostMesa([FromBody] Mesa mesa)
        {
            try
            {
                var nuevaMesa = await _service.CrearAsync(mesa);
                return CreatedAtAction(nameof(GetMesa), new { id = nuevaMesa.IdMesa }, nuevaMesa);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutMesa(int id, Mesa mesa)
        {
            if (id != mesa.IdMesa)
                return BadRequest(new { message = "El ID de la URL no coincide con el ID de la mesa." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, mesa);
                if (!actualizado)
                    return NotFound(new { message = $"Mesa con ID {id} no encontrada." });

                return Ok(new { message = "Mesa actualizada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteMesa(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Mesa con ID {id} no encontrada." });

                return Ok(new { message = "Mesa eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}