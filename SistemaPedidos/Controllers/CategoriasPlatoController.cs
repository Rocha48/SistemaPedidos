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
    public class CategoriasController : ControllerBase
    {
        private readonly CategoriaService _service;

        public CategoriasController(CategoriaService service)
        {
            _service = service;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategorias()
        {
            var categorias = await _service.ObtenerTodasAsync();
            return Ok(categorias);
        }

        [HttpGet("publicas")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicas()
        {
            var categorias = await _service.ObtenerTodasAsync();
            return Ok(categorias);
        }


        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategoria(int id)
        {
            var categoria = await _service.ObtenerPorIdAsync(id);
            if (categoria == null)
                return NotFound(new { message = $"Categoría con ID {id} no encontrada." });
            return Ok(categoria);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostCategoria(CategoriaPlato categoria)
        {
            try
            {
                var nuevaCategoria = await _service.CrearAsync(categoria);
                return CreatedAtAction(nameof(GetCategoria), new { id = nuevaCategoria.IdCategoria }, nuevaCategoria);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutCategoria(int id, CategoriaPlato categoria)
        {
            if (id != categoria.IdCategoria)
                return BadRequest(new { message = "El ID del cuerpo no coincide con el de la URL." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, categoria);
                if (!actualizado)
                    return NotFound(new { message = $"Categoría con ID {id} no encontrada." });

                return Ok(new { message = "Categoría actualizada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Categoría con ID {id} no encontrada." });

                return Ok(new { message = "Categoría eliminada correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}