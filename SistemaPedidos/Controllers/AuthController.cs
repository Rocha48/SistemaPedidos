using Microsoft.AspNetCore.Mvc;
using sistemapedidos.Business.Services;

namespace sistemapedidos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var token = _authService.Login(request.Username, request.Password);

            if (token == null)
                return Unauthorized(new { message = "Usuario o contraseña incorrectos" });

            return Ok(new { token });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
