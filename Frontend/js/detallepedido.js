// =========================================
//   CONFIGURACIÓN Y VARIABLES GLOBALES
// =========================================
const API_URL = "http://localhost:5151/api";

// Carrito en memoria (localStorage)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// =========================================
//   CARGAR CATEGORÍAS Y PRODUCTOS
// =========================================
async function cargarCategorias() {
    try {
        const response = await fetch(`${API_URL}/Categorias`);
        const categorias = await response.json();

        const listaCategorias = document.getElementById('lista-categorias');
        if (!listaCategorias) return;

        listaCategorias.innerHTML = '<button class="categoria-btn activa" onclick="filtrarPorCategoria(null)">Todas</button>';

        categorias.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'categoria-btn';
            btn.textContent = cat.nombre;
            btn.onclick = () => filtrarPorCategoria(cat.nombre);
            listaCategorias.appendChild(btn);
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

async function cargarProductos(categoriaFiltro = null) {
    try {
        const response = await fetch(`${API_URL}/Platos`);
        const productos = await response.json();

        const listaProductos = document.getElementById('lista-productos');
        if (!listaProductos) return;

        listaProductos.innerHTML = '';

        // Filtrar por categoría si se especifica
        const productosFiltrados = categoriaFiltro 
            ? productos.filter(p => p.categoria === categoriaFiltro)
            : productos;

        // Mostrar solo productos disponibles
        productosFiltrados
            .filter(p => p.disponible)
            .forEach(producto => {
                const div = document.createElement('div');
                div.className = 'producto-card';
                div.innerHTML = `
                    <img src="${producto.imagenURL || '../img/default.jpg'}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio}</p>
                    <button onclick="verDetalle(${producto.idPlato})">Ver detalle</button>
                `;
                listaProductos.appendChild(div);
            });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function filtrarPorCategoria(categoria) {
    // Actualizar botones activos
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('activa');
    });
    event.target.classList.add('activa');

    cargarProductos(categoria);
}
// =========================================
//   DETALLE DEL PRODUCTO
// =========================================
async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const idPlato = params.get('id');

    if (!idPlato) {
        alert('No se especificó un producto');
        window.location.href = 'menu.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/Platos/${idPlato}`);
        const producto = await response.json();

        document.getElementById('detalle-nombre').textContent = producto.nombre;
        document.getElementById('detalle-descripcion').textContent = producto.descripcion || 'Sin descripción';
        document.getElementById('detalle-precio').textContent = producto.precio;
        const rutaImagen = producto.imagenURL 
    ? `../${producto.imagenURL}` 
    : '../img/default.jpg';
document.getElementById('detalle-img').src = rutaImagen;

        // Botón agregar al pedido CON EFECTO VERDE
        const btnAgregar = document.getElementById('btn-agregar');
        btnAgregar.onclick = () => {
            agregarAlCarrito(producto);
            
            // Cambiar a verde
            btnAgregar.classList.add('agregado');
            const textoOriginal = btnAgregar.textContent;
            btnAgregar.textContent = '¡Agregado!';
            
            // Volver a normal después de 2 segundos
            setTimeout(() => {
                btnAgregar.classList.remove('agregado');
                btnAgregar.textContent = textoOriginal;
            }, 2000);
        };

    } catch (error) {
        console.error('Error cargando detalle:', error);
        alert('Error al cargar el producto');
    }
}

function verDetalle(idPlato) {
    window.location.href = `detalle.html?id=${idPlato}`;
}

// =========================================
//   MANEJO DE CANTIDAD
// =========================================
let cantidad = 1;

function actualizarCantidad() {
    const spanCantidad = document.getElementById('cantidad');
    if (spanCantidad) {
        spanCantidad.textContent = cantidad;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnSumar = document.getElementById('btn-sumar');
    const btnRestar = document.getElementById('btn-restar');

    if (btnSumar) {
        btnSumar.onclick = () => {
            cantidad++;
            actualizarCantidad();
        };
    }

    if (btnRestar) {
        btnRestar.onclick = () => {
            if (cantidad > 1) {
                cantidad--;
                actualizarCantidad();
            }
        };
    }

    // Cargar funciones según la página
    if (document.getElementById('lista-productos')) {
        cargarCategorias();
        cargarProductos();
    }

    if (document.getElementById('detalle-nombre')) {
        cargarDetalle();
    }

    if (document.getElementById('carrito-items')) {
        mostrarCarrito();
    }

    actualizarContadorCarrito();
});

// =========================================
//   CARRITO DE COMPRAS
// =========================================
function agregarAlCarrito(producto) {
    // Buscar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.idPlato === producto.idPlato);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            idPlato: producto.idPlato,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad,
            imagenURL: producto.imagenURL
        });
    }

    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar mensaje
    

    // Resetear cantidad
    cantidad = 1;
    actualizarCantidad();

    // Actualizar contador del carrito
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const btnCarrito = document.querySelector('.btn-carrito');
    
    if (btnCarrito) {
        btnCarrito.innerHTML = `🛒 ${totalItems > 0 ? `(${totalItems})` : ''}`;
    }
}

function abrirCarrito() {
    window.location.href = 'carrito.html';
}

function mostrarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const totalElement = document.getElementById('total-carrito');

    if (!carritoItems) return;

    carritoItems.innerHTML = '';

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">Tu pedido está vacío</p>';
        if (totalElement) totalElement.textContent = '0';
        return;
    }

    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML = `
            <img src="${item.imagenURL || '../img/default.jpg'}" alt="${item.nombre}">
            <div class="item-info">
                <h3>${item.nombre}</h3>
                <p>$${item.precio} × ${item.cantidad}</p>
                <p class="subtotal">Subtotal: $${subtotal}</p>
            </div>
            <div class="item-acciones">
                <button onclick="cambiarCantidad(${index}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button onclick="cambiarCantidad(${index}, 1)">+</button>
                <button onclick="eliminarDelCarrito(${index})" class="btn-eliminar">🗑️</button>
            </div>
        `;
        carritoItems.appendChild(div);
    });

    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
}

function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
}

function vaciarCarrito() {
    if (confirm('¿Seguro que querés vaciar tu pedido?')) {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        actualizarContadorCarrito();
    }
}

// =========================================
//   CONFIRMAR PEDIDO
// =========================================
async function confirmarPedido() {
    if (carrito.length === 0) {
        alert('Tu pedido está vacío');
        return;
    }

    const nombreCliente = document.getElementById('nombre-cliente')?.value.trim();
    
    if (!nombreCliente) {
        alert('Por favor ingresá tu nombre');
        return;
    }

    try {
        // Calcular total
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        // Crear el pedido
        const pedido = {
            nombreCliente: nombreCliente,
            total: total,
            estado: "Pendiente",
            detalles: carrito.map(item => ({
                idPlato: item.idPlato,
                cantidad: item.cantidad,
                precioUnitario: item.precio,
                subtotal: item.precio * item.cantidad
            }))
        };

        console.log('Enviando pedido:', pedido);

        const response = await fetch(`${API_URL}/Pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const resultado = await response.json();

        // Limpiar carrito
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));

        alert(`✓ Pedido confirmado! Número: ${resultado.idPedido}`);
        window.location.href = 'menu.html';

    } catch (error) {
        console.error('Error confirmando pedido:', error);
        alert('Error al confirmar el pedido: ' + error.message);
    }
}

// =========================================
//   SIDEBAR (MENÚ LATERAL)
// =========================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.toggle('abierto');
    overlay.classList.toggle('activo');
}

function cerrarSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.remove('abierto');
    overlay.classList.remove('activo');
}