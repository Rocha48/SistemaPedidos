using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using sistemapedidos.Data;
using sistemapedidos.Models;
using sistemapedidos.Helpers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace sistemapedidos.Business.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly AppSettings _appSettings;

        public AuthService(AppDbContext context, IOptions<AppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
        }

        public string? Login(string username, string password)
        {
            var user = _context.Usuarios
                .FirstOrDefault(u => u.Nombre == username && u.ContraseñaHash == password);

            if (user == null)
                return null;

            var role = _context.Roles.FirstOrDefault(r => r.IdRol == user.IdRol)?.NombreRol ?? "Usuario";

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_appSettings.JwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.IdUsuario.ToString()),
                    new Claim(ClaimTypes.Name, user.Nombre),
                    new Claim(ClaimTypes.Role, role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_appSettings.JwtExpireMinutes),
                Issuer = _appSettings.JwtIssuer,
                Audience = _appSettings.JwtAudience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
