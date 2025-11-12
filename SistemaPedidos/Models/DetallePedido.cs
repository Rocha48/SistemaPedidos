using System.ComponentModel.DataAnnotations;

namespace sistemapedidos.Models
{
    public class DetallePedido
    {

        [Key] public int IdDetalle { get; set; }
        public int IdPedido { get; set; }
        public int IdPlato { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
        public string? Observaciones { get; set; }

        public Pedido Pedido { get; set; }
        public Plato Plato { get; set; }
    }
}
