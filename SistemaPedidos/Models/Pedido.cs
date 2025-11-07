using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;

namespace sistemapedidos.Models
{
    public class Pedido
    {
        public int IdPedido { get; set; }
        public string NombreCliente { get; set; }
        public DateTime FechaHora { get; set; }
        public string Estado { get; set; }
        public decimal Total { get; set; }
        public int NumeroMesa { get; set; }

        public ICollection<DetallePedido> Detalles { get; set; }
        public ICollection<Pago> Pagos { get; set; }
    }
}
