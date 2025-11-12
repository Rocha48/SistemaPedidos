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
    public class RolesController : ControllerBase
    {
        private readonly RolService _service;

        public RolesController(RolService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _service.ObtenerTodosAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetRol(int id)
        {
            var rol = await _service.ObtenerPorIdAsync(id);
            if (rol == null)
                return NotFound(new { message = $"Rol con ID {id} no encontrado." });
            return Ok(rol);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PostRol(Rol rol)
        {
            try
            {
                var nuevoRol = await _service.CrearAsync(rol);
                return Ok(new { message = "Rol creado correctamente.", id = nuevoRol.IdRol });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> PutRol(int id, Rol rol)
        {
            if (id != rol.IdRol)
                return BadRequest(new { message = "El ID de la URL no coincide con el ID del rol." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, rol);
                if (!actualizado)
                    return NotFound(new { message = $"Rol con ID {id} no encontrado." });

                return Ok(new { message = "Rol actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteRol(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Rol con ID {id} no encontrado." });

                return Ok(new { message = "Rol eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}