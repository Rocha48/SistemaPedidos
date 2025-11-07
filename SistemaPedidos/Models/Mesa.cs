using System.Collections.Generic;

namespace sistemapedidos.Models
{
    public class Mesa
    {
        public int IdMesa { get; set; }
        public int Numero { get; set; }
        public string Estado { get; set; }
        public int? Capacidad { get; set; }
        public bool Activa { get; set; }
    }
}
