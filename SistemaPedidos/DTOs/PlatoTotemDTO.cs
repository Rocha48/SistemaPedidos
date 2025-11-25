namespace sistemapedidos.DTOs
{
    public class PlatoTotemDTO
    {
        public int IdPlato { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int IdCategoria { get; set; }
        public string ImagenURL { get; set; }
        public bool Disponible { get; set; }
    }

}
