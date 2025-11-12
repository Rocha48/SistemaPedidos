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
    public class UsuariosController : ControllerBase
    {
        private readonly UsuarioService _service;

        public UsuariosController(UsuarioService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _service.ObtenerTodosAsync();
            return Ok(usuarios);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetUsuario(int id)
        {
            var usuario = await _service.ObtenerPorIdAsync(id);
            if (usuario == null)
                return NotFound(new { message = $"Usuario con ID {id} no encontrado." });
            return Ok(usuario);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostUsuario(UsuarioDTO dto)
        {
            try
            {
                var usuario = await _service.CrearAsync(dto);
                return Ok(new { message = "Usuario creado correctamente.", id = usuario.IdUsuario });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutUsuario(int id, UsuarioDTO dto)
        {
            if (id != dto.IdUsuario)
                return BadRequest(new { message = "El ID de la URL no coincide con el ID del usuario." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, dto);
                if (!actualizado)
                    return NotFound(new { message = $"Usuario con ID {id} no encontrado." });

                return Ok(new { message = "Usuario actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Usuario con ID {id} no encontrado." });

                return Ok(new { message = "Usuario eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}