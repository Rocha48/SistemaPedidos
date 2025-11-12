using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sistemapedidos.Models
{
    [Table("categoriasplato")]
    public class CategoriaPlato
    {

        [Key] public int IdCategoria { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        public ICollection<Plato>? Platos { get; set; }
    }
}