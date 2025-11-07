using System.Collections.Generic;

namespace sistemapedidos.Models
{
    public class CategoriaPlato
    {
        public int IdCategoria { get; set; }
        public string Nombre { get; set; }

        public ICollection<Plato> Platos { get; set; }
    }
}
