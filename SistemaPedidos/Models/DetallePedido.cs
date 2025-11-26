using System.ComponentModel.DataAnnotations;


namespace sistemapedidos.Models
{
    public class DetallePedido
    {
        [Key] public int IdDetalle { get; set; }
        public int IdPedido { get; set; }
        public int IdPlato { get; set; }

        // ✅ IMPORTANTE: Objetos de navegación OPCIONALES
        public Plato? Plato { get; set; }
        public Pedido? Pedido { get; set; }

        [Required]
        public int Cantidad { get; set; }
        
        [Required]
        public decimal PrecioUnitario { get; set; }
        
        [Required]
        public decimal Subtotal { get; set; }
        
        public string? Observaciones { get; set; }
    }
}