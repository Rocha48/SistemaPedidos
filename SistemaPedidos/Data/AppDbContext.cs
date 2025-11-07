using Microsoft.EntityFrameworkCore;
using sistemapedidos.Models;

namespace sistemapedidos.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Rol> Roles { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<CategoriaPlato> CategoriasPlato { get; set; }
        public DbSet<Plato> Platos { get; set; }
        public DbSet<Mesa> Mesas { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<DetallePedido> DetallePedidos { get; set; }
        public DbSet<Pago> Pagos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de nombres de tabla exactos
            modelBuilder.Entity<Rol>().ToTable("Roles");
            modelBuilder.Entity<Usuario>().ToTable("Usuarios");
            modelBuilder.Entity<CategoriaPlato>().ToTable("CategoriasPlato");
            modelBuilder.Entity<Plato>().ToTable("Platos");
            modelBuilder.Entity<Mesa>().ToTable("Mesas");
            modelBuilder.Entity<Pedido>().ToTable("Pedidos");
            modelBuilder.Entity<DetallePedido>().ToTable("DetallePedido");
            modelBuilder.Entity<Pago>().ToTable("Pagos");

            // Relaciones
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany(r => r.Usuarios)
                .HasForeignKey(u => u.IdRol);

            modelBuilder.Entity<Plato>()
                .HasOne(p => p.Categoria)
                .WithMany(c => c.Platos)
                .HasForeignKey(p => p.IdCategoria);

            modelBuilder.Entity<DetallePedido>()
                .HasOne(d => d.Pedido)
                .WithMany(p => p.Detalles)
                .HasForeignKey(d => d.IdPedido);

            modelBuilder.Entity<DetallePedido>()
                .HasOne(d => d.Plato)
                .WithMany(p => p.DetallesPedido)
                .HasForeignKey(d => d.IdPlato);

            modelBuilder.Entity<Pago>()
                .HasOne(pg => pg.Pedido)
                .WithMany(p => p.Pagos)
                .HasForeignKey(pg => pg.IdPedido);
        }
    }
}
