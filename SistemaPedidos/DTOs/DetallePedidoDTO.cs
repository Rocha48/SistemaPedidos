namespace sistemapedidos.DTOs
{
    public class DetallePedidoDTO
    {
        public int IdDetalle { get; set; }
        public int IdPedido { get; set; }             // ← AGREGAR ESTO
        public int IdPlato { get; set; }
        public string? NombrePlato { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
        public string? Observaciones { get; set; }
    }
}