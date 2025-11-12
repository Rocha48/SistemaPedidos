using System;
using System.Collections.Generic;

namespace sistemapedidos.DTOs
{
    public class PedidoDTO
    {
        public int IdPedido { get; set; }
        public string NombreCliente { get; set; }
        public DateTime FechaHora { get; set; }
        public string Estado { get; set; }
        public decimal Total { get; set; }
        public int NumeroMesa { get; set; }
        public List<DetallePedidoDTO> Detalles { get; set; }
    }
}
