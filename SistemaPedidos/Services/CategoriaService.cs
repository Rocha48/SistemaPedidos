using Microsoft.EntityFrameworkCore;
using sistemapedidos.Data;
using sistemapedidos.Models;
using System;

namespace sistemapedidos.Business.Services
{
    public class CategoriaService
    {
        private readonly AppDbContext _context;

        public CategoriaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoriaPlato>> ObtenerTodasAsync()
        {
            return await _context.CategoriasPlato.ToListAsync();
        }

        public async Task<CategoriaPlato?> ObtenerPorIdAsync(int id)
        {
            return await _context.CategoriasPlato.FindAsync(id);
        }

        public async Task<CategoriaPlato> CrearAsync(CategoriaPlato categoria)
        {
            // Validación: nombre no puede estar vacío
            if (string.IsNullOrWhiteSpace(categoria.Nombre))
                throw new ArgumentException("El nombre de la categoría es obligatorio.");

            // Validación: nombre no puede estar duplicado
            var existe = await _context.CategoriasPlato
                .AnyAsync(c => c.Nombre.ToLower() == categoria.Nombre.ToLower());

            if (existe)
                throw new InvalidOperationException("Ya existe una categoría con ese nombre.");

            _context.CategoriasPlato.Add(categoria);
            await _context.SaveChangesAsync();
            return categoria;
        }

        public async Task<bool> ActualizarAsync(int id, CategoriaPlato categoria)
        {
            var existing = await _context.CategoriasPlato.FindAsync(id);
            if (existing == null)
                return false;

            // Validación: nombre no puede estar vacío
            if (string.IsNullOrWhiteSpace(categoria.Nombre))
                throw new ArgumentException("El nombre de la categoría es obligatorio.");

            existing.Nombre = categoria.Nombre;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            var categoria = await _context.CategoriasPlato.FindAsync(id);
            if (categoria == null)
                return false;

            // Validación: no se puede eliminar si tiene platos asociados
            var tienePlatos = await _context.Platos.AnyAsync(p => p.IdCategoria == id);
            if (tienePlatos)
                throw new InvalidOperationException("No se puede eliminar una categoría que tiene platos asociados.");

            _context.CategoriasPlato.Remove(categoria);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
