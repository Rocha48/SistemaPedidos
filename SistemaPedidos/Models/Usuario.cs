using System;

namespace sistemapedidos.Models
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string ContraseñaHash { get; set; }
        public int IdRol { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }

        public Rol Rol { get; set; }
    }
}
