using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using sistemapedidos.DTOs;
using sistemapedidos.Services;

namespace sistemapedidos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class PlatosController : ControllerBase
    {
        private readonly PlatoService _service;

        public PlatosController(PlatoService service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetPlatos()
        {
            var platos = await _service.ObtenerTodosAsync();
            return Ok(platos);
        }


        [HttpGet("publicos")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicos()
        {
            var platos = await _service.ObtenerTodosAsync();
            return Ok(platos);
        }


        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPlato(int id)
        {
            var plato = await _service.ObtenerPorIdAsync(id);
            if (plato == null)
                return NotFound(new { message = $"Plato con ID {id} no encontrado." });
            return Ok(plato);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostPlato(PlatoDTO dto)
        {
            try
            {
                var plato = await _service.CrearAsync(dto);
                return Ok(new { message = "Plato creado correctamente.", id = plato.IdPlato });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutPlato(int id, PlatoDTO dto)
        {
            if (id != dto.IdPlato)
                return BadRequest(new { message = "El ID del cuerpo no coincide con el de la URL." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, dto);
                if (!actualizado)
                    return NotFound(new { message = $"Plato con ID {id} no encontrado." });

                return Ok(new { message = "Plato actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeletePlato(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Plato con ID {id} no encontrado." });

                return Ok(new { message = "Plato eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}