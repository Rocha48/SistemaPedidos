using System;
using System.ComponentModel.DataAnnotations;

namespace sistemapedidos.Models
{
    public class Pago
    {

        [Key] public int IdPago { get; set; }
        public int IdPedido { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
        public DateTime FechaPago { get; set; }
        public string? NumeroTransaccion { get; set; }

        public Pedido Pedido { get; set; }
    }
}
