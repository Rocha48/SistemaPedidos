// Evitar retroceso en navegadores
history.pushState(null, "", location.href);
window.onpopstate = () => {
    history.pushState(null, "", location.href);
};

/* =======================================
   MÓDULO DE SELECCIÓN DE MESAS (TÓTEM)
   ======================================= */

async function cargarMesasTotem() {
    const API_URL = "http://localhost:5151/api/Mesas/publicas";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Error al obtener mesas: " + response.status);
        }

        const mesas = await response.json();
        const contenedor = document.getElementById("mesas-grid");
        if (!contenedor) return;
        contenedor.innerHTML = "";

        mesas.forEach(m => {
            const btn = document.createElement("button");
            btn.classList.add("mesa-btn");

            const numero = m.numero ?? m.Numero;
            const estado = m.estado ?? m.Estado;

            if (estado && estado.toLowerCase() === "ocupada") {
                btn.classList.add("mesa-ocupada");
                btn.textContent = `Mesa ${numero} (ocupada)`;
                btn.disabled = true;
            } else {
                btn.classList.add("mesa-libre");
                btn.textContent = `Mesa ${numero}`;
                btn.onclick = () => seleccionarMesaTotem(numero, btn);
            }

            contenedor.appendChild(btn);
        });

    } catch (error) {
        alert("❌ Error cargando mesas.");
        console.error(error);
    }
}

let mesaSeleccionadaTotem = null;

function seleccionarMesaTotem(numMesa, boton) {
    mesaSeleccionadaTotem = numMesa;

    document.querySelectorAll(".mesa-btn").forEach(b =>
        b.classList.remove("mesa-seleccionada")
    );

    boton.classList.add("mesa-seleccionada");

    const btnContinuar = document.getElementById("btnContinuar");
    if (btnContinuar) btnContinuar.disabled = false;

    // Agregar texto de confirmación
    const pedidoBox = document.querySelector('.screen-mesas .pedido-box');
    let mensajeSeleccion = pedidoBox.querySelector('.mensaje-mesa-seleccionada');
    
    if (!mensajeSeleccion) {
        mensajeSeleccion = document.createElement('p');
        mensajeSeleccion.className = 'mensaje-mesa-seleccionada';
        pedidoBox.appendChild(mensajeSeleccion);
    }
    
    mensajeSeleccion.textContent = `Mesa #${numMesa} seleccionada`;  // ← CAMBIO AQUÍ
}

function confirmarMesa() {
    if (!mesaSeleccionadaTotem) return;

    localStorage.setItem("tipoPedido", "local");
    localStorage.setItem("mesaSeleccionada", mesaSeleccionadaTotem);

    window.location.href = "../totem/menu.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("mesas-grid")) {
        cargarMesasTotem();
    }
});




/* ======================================================
   CATEGORÍAS Y PRODUCTOS (TÓTEM) - CONEXIÓN REAL API
   ====================================================== */

const API_CATEGORIAS = "http://localhost:5151/api/Categorias";
const API_PLATOS = "http://localhost:5151/api/Platos"; 

let categoriasBackend = [];
let productosBackend = [];

/* CARGAR CATEGORÍAS */
async function cargarCategorias() {
    try {
        const resp = await fetch(API_CATEGORIAS);
        if (!resp.ok) throw new Error("Error obteniendo categorías");

        categoriasBackend = await resp.json();

        const contenedor = document.getElementById("lista-categorias");
        if (!contenedor) return;
        contenedor.innerHTML = "";

        // Botón TODOS
        const btnTodos = document.createElement("div");
        btnTodos.className = "categoria-btn";
        btnTodos.textContent = "Todos";
        btnTodos.onclick = () => {
            mostrarTodosLosProductos();
            cerrarSidebar();
        };
        contenedor.appendChild(btnTodos);

        // CATEGORÍAS DINÁMICAS
        categoriasBackend.forEach(cat => {
            const nombreCat = cat.nombre ?? cat.Nombre;

            const btn = document.createElement("div");
            btn.className = "categoria-btn";
            btn.textContent = nombreCat;
            btn.onclick = () => {
                filtrarPorCategoria(nombreCat);
                cerrarSidebar();
            };

            contenedor.appendChild(btn);
        });

    } catch (e) {
        console.error(e);
        alert("❌ Error al cargar categorías");
    }
}

/* CARGAR PRODUCTOS */
async function cargarProductos() {
    try {
        const resp = await fetch(API_PLATOS);
        if (!resp.ok) throw new Error("Error productos");

        productosBackend = await resp.json();

        mostrarTodosLosProductos();
        cargarSugerencias();

    } catch (e) {
        console.error(e);
        alert("Error cargando productos");
    }
}

/* MOSTRAR TODOS */
function mostrarTodosLosProductos() {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    productosBackend.forEach(prod => {
        contenedor.appendChild(crearCardProducto(prod));
    });
}

/* SUGERENCIAS */
function cargarSugerencias() {
    const contenedor = document.getElementById("sugerencias");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    productosBackend
        .filter(p => p.sugerido ?? p.Sugerido)
        .forEach(prod => contenedor.appendChild(crearCardProducto(prod)));
}


/* CARD DE PRODUCTO */
function crearCardProducto(prod) {
    const nombre = prod.nombre;
    const precio = prod.precio;
    const categoria = prod.categoria;
    const imagen = prod.imagenURL;
    const id = prod.idPlato;

    const div = document.createElement("div");
    div.className = "item-card";

    // CORRECCIÓN: Quitar "Frontend/" de la ruta
    const rutaImagen = `../img/${imagen.split('/').pop()}`;

    div.innerHTML = `
        <img src="${rutaImagen}" alt="${nombre}">
        <div class="item-info">
            <h3>${nombre}</h3>
            <p class="precio">$${precio}</p>
        </div>
    `;

    div.onclick = () => {
        window.location.href = `detalle.html?id=${id}`;
    };

    return div;
}
/* FILTRAR */
function filtrarPorCategoria(nombreCategoria) {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    productosBackend
        .filter(p => p.categoria === nombreCategoria)
        .forEach(prod => contenedor.appendChild(crearCardProducto(prod)));
}

/* INICIALIZAR EN menu.html */
if (document.body.classList.contains("pantalla-menu")) {
    cargarCategorias();
    cargarProductos();
}

/* ======================================================
   SIDEBAR
====================================================== */
function cerrarSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (sidebar) sidebar.classList.remove("sidebar-open");
    if (overlay) overlay.classList.remove("activo");
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    sidebar.classList.toggle("sidebar-open");
    overlay.classList.toggle("activo");
}



   
// -----------------------------
// ABRIR CARRITO DESDE EL MENU
// -----------------------------
function abrirCarrito() {
    window.location.href = "carrito.html";
}
// ==============================
//   PANTALLA DE CONFIRMACIÓN
// ==============================


// ==============================
//   VOLVER AL INICIO
// ==============================
window.volverInicio = function () {

    // Limpiar solo al final
    localStorage.removeItem("carrito");
    localStorage.removeItem("nombreCliente");
    localStorage.removeItem("metodoPago");
    localStorage.removeItem("observacionesGenerales");
    localStorage.removeItem("mesa");
    localStorage.removeItem("tipoPedido");

    window.location.href = "../index.html";
};





// ===========================================
// FUNCIÓN CERRAR SESIÓN (ADMIN)
// ===========================================
function cerrarSesion() {
    document.getElementById("modalLogout").classList.remove("oculto");

    document.getElementById("logout-confirm").onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("usuario");
        window.location.href = "../../admin-login.html";
    };

    document.getElementById("logout-cancel").onclick = () => {
        document.getElementById("modalLogout").classList.add("oculto");
    };
}

/*MENU MOVIL PANEL DE ADMIN */
function toggleMenuMobile() {
    const menu = document.getElementById("sidebarMobile");
    if (menu) {
        menu.classList.toggle("activo");
    }
}

// Cerrar sidebar móvil al hacer click fuera
document.addEventListener("click", function (e) {
    const sidebar = document.getElementById("sidebarMobile");
    const btnMenu = document.querySelector(".menu-mobile-btn");

    if (!sidebar || !btnMenu) return;

    if (!sidebar.classList.contains("activo")) return;
    if (sidebar.contains(e.target)) return;
    if (btnMenu.contains(e.target)) return;

    sidebar.classList.remove("activo");
});


