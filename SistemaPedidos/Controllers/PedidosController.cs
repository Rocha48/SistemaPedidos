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
    public class PedidosController : ControllerBase
    {
        private readonly PedidoService _service;

        public PedidosController(PedidoService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador,Cajero,Cocina,Mozo")]
        public async Task<IActionResult> GetPedidos()
        {
            var pedidos = await _service.ObtenerTodosAsync();
            return Ok(pedidos);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador,Cajero,Cocina,Mozo")]
        public async Task<IActionResult> GetPedido(int id)
        {
            var pedido = await _service.ObtenerPorIdAsync(id);
            if (pedido == null)
                return NotFound(new { message = $"Pedido con ID {id} no encontrado." });
            return Ok(pedido);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador,Mozo")]
        public async Task<IActionResult> PostPedido(Pedido pedido)
        {
            try
            {
                var nuevoPedido = await _service.CrearAsync(pedido);
                return Ok(new { message = "Pedido creado correctamente.", id = nuevoPedido.IdPedido });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador,Cajero,Cocina,Mozo")]
        public async Task<IActionResult> PutPedido(int id, Pedido pedido)
        {
            if (id != pedido.IdPedido)
                return BadRequest(new { message = "El ID del cuerpo no coincide con el de la URL." });

            try
            {
                var actualizado = await _service.ActualizarAsync(id, pedido);
                if (!actualizado)
                    return NotFound(new { message = $"Pedido con ID {id} no encontrado." });

                return Ok(new { message = "Pedido actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            try
            {
                var eliminado = await _service.EliminarAsync(id);
                if (!eliminado)
                    return NotFound(new { message = $"Pedido con ID {id} no encontrado." });

                return Ok(new { message = "Pedido eliminado correctamente." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}