using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sistemapedidos.Models
{
    public class Rol
    {
        [Key] public int IdRol { get; set; }
        public string NombreRol { get; set; }
        public string? Descripcion { get; set; }

        public ICollection<Usuario> Usuarios { get; set; }
    }
}
