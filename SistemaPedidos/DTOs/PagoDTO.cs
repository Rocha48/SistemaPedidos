using System;

namespace sistemapedidos.DTOs
{
    public class PagoDTO
    {
        public int IdPago { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
        public DateTime FechaPago { get; set; }
        public string NumeroTransaccion { get; set; }
    }
}
