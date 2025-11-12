namespace sistemapedidos.DTOs
{
    public class PlatoDTO
    {
        public int IdPlato { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public string Categoria { get; set; }
        public string ImagenURL { get; set; }
        public bool Disponible { get; set; }
    }
}
