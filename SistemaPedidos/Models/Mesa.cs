using System.ComponentModel.DataAnnotations;

namespace sistemapedidos.Models
{
    public class Mesa
    {
        [Key] 
        public int IdMesa { get; set; }

        [Required]
        public int Numero { get; set; }
        
        
        public string? Estado { get; set; }
        
        public int? Capacidad { get; set; }
        
        public bool Activa { get; set; } = false;
    }
}