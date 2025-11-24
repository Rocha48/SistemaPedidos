using System;

namespace sistemapedidos.DTOs
{
    public class UsuarioDTO
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; } 

        public string Rol { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
