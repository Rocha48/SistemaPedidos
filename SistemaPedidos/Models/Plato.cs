using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sistemapedidos.Models
{
    public class Plato
    {
        [Key] public int IdPlato { get; set; }
        public string Nombre { get; set; }
        public string? Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int IdCategoria { get; set; }
        public string? ImagenURL { get; set; }
        public bool Disponible { get; set; }
        public DateTime FechaCreacion { get; set; }

        public CategoriaPlato Categoria { get; set; }
        public ICollection<DetallePedido> DetallesPedido { get; set; }
    }
}
