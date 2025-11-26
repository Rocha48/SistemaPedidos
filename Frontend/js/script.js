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

    const rutaImagen = `../Frontend/img/${imagen.split('/').pop()}`;

    div.innerHTML = `
        <img src="${rutaImagen}" alt="${nombre}">
        <h3>${nombre}</h3>
        <p>$${precio}</p>
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

/* =======================================
   DETALLE DEL PRODUCTO (BACKEND REAL)
   ======================================= */


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










// =========================================================
//   PANEL DE COCINA - VERSIÓN PROFESIONAL
//   Basado en el backend: Models/Pedido.cs
// =========================================================

if (document.body.classList.contains("cocina-body")) {

    console.log("🍳 Panel de Cocina iniciado");

    // Variables globales
    let pedidosActuales = [];
    let filtroActivo = "todos";
    let pedidoSeleccionado = null;

    // =============================
    //   VERIFICAR AUTENTICACIÓN
    // =============================
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const usuario = localStorage.getItem("usuario");

    if (!token || rol !== "Cocina") {
        alert("No tenés acceso a esta sección");
        window.location.href = "../../admin-login.html";
    }

    // Mostrar nombre del usuario en el header
    document.getElementById("nombreUsuario").textContent = usuario || "cocinero";

    // =============================
    //   INICIALIZAR PEDIDOS EJEMPLO
    // =============================
    const pedidosExistentes = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];

    // Solo crear ejemplos si NO hay pedidos activos
    const pedidosActivos = pedidosExistentes.filter(p => 
        p.Estado === "Pendiente" || 
        p.Estado === "EnPreparacion" || 
        p.Estado === "Listo"
    );

    if (pedidosActivos.length === 0) {
        inicializarPedidosEjemplo();
    }

    // =============================
    //   CARGAR AL INICIAR
    // =============================
    cargarPedidos();
    configurarEventListeners();

    // Auto-refresh cada 30 segundos
    setInterval(() => {
        cargarPedidos();
        console.log("🔄 Pedidos actualizados automáticamente");
    }, 30000);


    // =============================
    //   CREAR PEDIDOS DE EJEMPLO
    // =============================
    function inicializarPedidosEjemplo() {
        const pedidosEjemplo = [
            {
                IdPedido: 1,
                NombreCliente: "Juan Pérez",
                TipoPedido: "local", // ← CORREGIDO
                NumeroMesa: 5,
                FechaHora: new Date(Date.now() - 17 * 60000).toISOString(),
                Estado: "Pendiente",
                Total: 8500,
                Detalles: [
                    { IdPlato: 1, NombrePlato: "Hamburguesa Doble", Cantidad: 2 },
                    { IdPlato: 3, NombrePlato: "Papas Grandes", Cantidad: 1 }
                ],
                ObservacionesGenerales: "Sin cebolla en la hamburguesa"
            },
            {
                IdPedido: 2,
                NombreCliente: "María González",
                TipoPedido: "llevar", // ← CORREGIDO
                NumeroMesa: null,
                FechaHora: new Date(Date.now() - 12 * 60000).toISOString(),
                Estado: "EnPreparacion",
                Total: 6200,
                Detalles: [
                    { IdPlato: 2, NombrePlato: "McPollo Deluxe", Cantidad: 1 },
                    { IdPlato: 4, NombrePlato: "Coca-Cola 500ml", Cantidad: 2 }
                ],
                ObservacionesGenerales: "McPollo bien cocido"
            },
            {
                IdPedido: 3,
                NombreCliente: "Carlos Ruiz",
                TipoPedido: "local", // ← CORREGIDO
                NumeroMesa: 8,
                FechaHora: new Date(Date.now() - 9 * 60000).toISOString(),
                Estado: "Listo",
                Total: 4500,
                Detalles: [
                    { IdPlato: 5, NombrePlato: "Sundae de Chocolate", Cantidad: 2 }
                ],
                ObservacionesGenerales: ""
            },
            {
                IdPedido: 4,
                NombreCliente: "Ana Martínez",
                TipoPedido: "llevar", // ← CORREGIDO
                NumeroMesa: null,
                FechaHora: new Date(Date.now() - 22 * 60000).toISOString(),
                Estado: "Pendiente",
                Total: 9800,
                Detalles: [
                    { IdPlato: 1, NombrePlato: "Hamburguesa Doble", Cantidad: 3 },
                    { IdPlato: 3, NombrePlato: "Papas Grandes", Cantidad: 2 }
                ],
                ObservacionesGenerales: "Papas bien cocidas, sin sal"
            }
        ];

        localStorage.setItem("pedidosHistorial", JSON.stringify(pedidosEjemplo));
        console.log("✅ Pedidos de ejemplo creados");
    }


    // =============================
    //   CARGAR PEDIDOS
    // =============================
    function cargarPedidos() {
        const todosPedidos = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];

        pedidosActuales = todosPedidos.filter(p => 
            p.Estado === "Pendiente" || 
            p.Estado === "EnPreparacion" || 
            p.Estado === "Listo"
        );

        let pedidosFiltrados = pedidosActuales;
        if (filtroActivo !== "todos") {
            pedidosFiltrados = pedidosActuales.filter(p => p.Estado === filtroActivo);
        }

        renderizarPedidos(pedidosFiltrados);
        actualizarContadores();

        console.log(`📊 ${pedidosActuales.length} pedidos activos`);
    }


    // =============================
    //   RENDERIZAR PEDIDOS
    // =============================
    function renderizarPedidos(pedidos) {
        document.getElementById("listaPendientes").innerHTML = "";
        document.getElementById("listaPreparacion").innerHTML = "";
        document.getElementById("listaListos").innerHTML = "";

        const pendientes = pedidos.filter(p => p.Estado === "Pendiente");
        const preparacion = pedidos.filter(p => p.Estado === "EnPreparacion");
        const listos = pedidos.filter(p => p.Estado === "Listo");

        pendientes.forEach(p => {
            document.getElementById("listaPendientes").appendChild(crearFilaPedido(p));
        });

        preparacion.forEach(p => {
            document.getElementById("listaPreparacion").appendChild(crearFilaPedido(p));
        });

        listos.forEach(p => {
            document.getElementById("listaListos").appendChild(crearFilaPedido(p));
        });

        mostrarMensajeVacio("listaPendientes", pendientes.length);
        mostrarMensajeVacio("listaPreparacion", preparacion.length);
        mostrarMensajeVacio("listaListos", listos.length);
    }


// =============================================
//   CREAR FILA DE PEDIDO (NUEVO DISEÑO LISTA)
// =============================================

function crearCardPedido(pedido) {
    const fila = document.createElement("div");
    fila.className = "pedido-fila";

    // Determinar tipo de pedido
    const tipoPedido = pedido.numeroMesa > 0 
        ? `Mesa ${pedido.numeroMesa}` 
        : "Para llevar";

    // Calcular tiempo transcurrido
    const tiempoTranscurrido = calcularTiempoTranscurrido(pedido.fechaHora);

    // Generar lista de items
    const itemsHTML = pedido.detalles.map(detalle => `
        <div class="item-linea">
            <span class="item-cant">${detalle.cantidad}x</span>
            <span class="item-nom">${detalle.nombrePlato || 'Producto'}</span>
            ${detalle.observaciones ? `<span class="item-obs">(${detalle.observaciones})</span>` : ''}
        </div>
    `).join('');

    // Construir fila
    fila.innerHTML = `
        <div class="pedido-col pedido-numero">
            <div class="label-numero">#${pedido.idPedido}</div>
            <div class="estado-badge estado-${pedido.estado.toLowerCase().replace(' ', '-')}">${pedido.estado}</div>
        </div>

        <div class="pedido-col pedido-info-cliente">
            <div class="info-row">
                <span class="info-label">Cliente:</span>
                <span class="info-valor">${pedido.nombreCliente}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Ubicación:</span>
                <span class="info-valor">${tipoPedido}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tiempo:</span>
                <span class="info-valor">${tiempoTranscurrido}</span>
            </div>
        </div>

        <div class="pedido-col pedido-detalle-items">
            <div class="items-titulo">Productos:</div>
            ${itemsHTML}
        </div>

        <div class="pedido-col pedido-total-accion">
            <div class="total-monto">$${pedido.total.toFixed(2)}</div>
            ${pedido.estado === "Listo" ? `
                <button class="btn-entregar-lista" onclick="abrirModalEntrega(${pedido.idPedido})">
                    Marcar Entregado
                </button>
            ` : ''}
        </div>
    `;

    return fila;
}


    // =============================
    //   CALCULAR TIEMPO TRANSCURRIDO
    // =============================
    function calcularTiempoTranscurrido(fechaHora) {
        const ahora = new Date();
        const fecha = new Date(fechaHora);
        const diff = Math.floor((ahora - fecha) / 1000);

        const minutos = Math.floor(diff / 60);
        const horas = Math.floor(minutos / 60);

        let texto = "";
        if (horas > 0) {
            texto = `${horas}h ${minutos % 60}m`;
        } else if (minutos > 0) {
            texto = `${minutos}m`;
        } else {
            texto = "Ahora";
        }

        const urgente = minutos > 15;

        return { minutos, horas, texto, urgente };
    }


    // =============================
    //   MOSTRAR MENSAJE SI VACÍO
    // =============================
    function mostrarMensajeVacio(contenedorId, cantidad) {
        const contenedor = document.getElementById(contenedorId);
        
        if (cantidad === 0) {
            contenedor.innerHTML = `
                <div class="lista-vacia">
                    <p>No hay pedidos en esta sección</p>
                </div>
            `;
        }
    }


    // =============================
    //   ABRIR DETALLE DEL PEDIDO
    // =============================
    window.abrirDetallePedido = function(idPedido) {
        const pedido = pedidosActuales.find(p => p.IdPedido === idPedido);
        
        if (!pedido) {
            alert("Pedido no encontrado");
            return;
        }

        pedidoSeleccionado = pedido;

        document.getElementById("modalTitulo").textContent = `Pedido #${pedido.IdPedido}`;
        document.getElementById("detallePedidoId").textContent = `#${pedido.IdPedido}`;
        
        // Tipo de pedido
        const tipoTexto = pedido.TipoPedido === "llevar" ? "Para Llevar" : "Consumir en Local";
        document.getElementById("detalleTipo").textContent = tipoTexto;

        // Mesa
        if (pedido.TipoPedido === "llevar") {
            document.getElementById("detalleMesa").textContent = "No aplica";
        } else {
            document.getElementById("detalleMesa").textContent = pedido.NumeroMesa;
        }

        document.getElementById("detalleCliente").textContent = pedido.NombreCliente;

        const fecha = new Date(pedido.FechaHora);
        document.getElementById("detalleHora").textContent = fecha.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const tiempo = calcularTiempoTranscurrido(pedido.FechaHora);
        document.getElementById("detalleTiempo").textContent = `Hace ${tiempo.texto}`;

        const estadoTexto = obtenerTextoEstado(pedido.Estado);
        const badgeEstado = document.getElementById("detalleEstado");
        badgeEstado.textContent = estadoTexto;
        badgeEstado.className = `info-valor badge-estado ${pedido.Estado.toLowerCase()}`;

        const listaProductos = document.getElementById("detalleListaProductos");
        listaProductos.innerHTML = pedido.Detalles.map(detalle => `
            <div class="producto-item">
                <span class="producto-cantidad">${detalle.Cantidad}x</span>
                <span class="producto-nombre">${detalle.NombrePlato}</span>
            </div>
        `).join('');

        const containerObs = document.getElementById("detalleObservaciones");
        const textoObs = document.getElementById("detalleTextoObservaciones");
        
        if (pedido.ObservacionesGenerales && pedido.ObservacionesGenerales.trim() !== "") {
            textoObs.textContent = pedido.ObservacionesGenerales;
            containerObs.style.display = "block";
        } else {
            containerObs.style.display = "none";
        }

        document.getElementById("detalleTotal").textContent = `$${pedido.Total.toLocaleString('es-AR')}`;

        const btnModal = document.getElementById("btnCambiarEstadoModal");
        
        if (pedido.Estado === "Pendiente") {
            btnModal.textContent = "Iniciar Preparación";
            btnModal.style.display = "block";
        } else if (pedido.Estado === "EnPreparacion") {
            btnModal.textContent = "Marcar como Listo";
            btnModal.style.display = "block";
        } else {
            btnModal.textContent = "Marcar como Entregado";
            btnModal.style.display = "block";
        }

        document.getElementById("modalDetalle").classList.remove("oculto");
    };


    // =============================
    //   CAMBIAR ESTADO DEL PEDIDO
    // =============================
    window.cambiarEstadoPedido = function(idPedido) {
        const pedido = pedidosActuales.find(p => p.IdPedido === idPedido);
        
        if (!pedido) {
            alert("Pedido no encontrado");
            return;
        }

        let nuevoEstado = "";
        let mensaje = "";

        if (pedido.Estado === "Pendiente") {
            nuevoEstado = "EnPreparacion";
            mensaje = `¿Iniciar la preparación del Pedido #${idPedido}?`;
        } else if (pedido.Estado === "EnPreparacion") {
            nuevoEstado = "Listo";
            mensaje = `¿Marcar el Pedido #${idPedido} como LISTO para servir?`;
        } else if (pedido.Estado === "Listo") {
            nuevoEstado = "Entregado";
            mensaje = `¿El Pedido #${idPedido} fue entregado al cliente?`;
        }

        document.getElementById("mensajeConfirmacion").textContent = mensaje;
        document.getElementById("modalConfirmacion").classList.remove("oculto");

        document.getElementById("btnConfirmarAccion").onclick = () => {
            ejecutarCambioEstado(idPedido, nuevoEstado);
        };
    };


    window.cambiarEstadoDesdeModal = function() {
        if (pedidoSeleccionado) {
            cambiarEstadoPedido(pedidoSeleccionado.IdPedido);
        }
    };


    function ejecutarCambioEstado(idPedido, nuevoEstado) {
        const pedido = pedidosActuales.find(p => p.IdPedido === idPedido);
        if (pedido) {
            pedido.Estado = nuevoEstado;
        }

        const todosPedidos = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];
        const index = todosPedidos.findIndex(p => p.IdPedido === idPedido);
        
        if (index !== -1) {
            todosPedidos[index].Estado = nuevoEstado;
            
            if (nuevoEstado === "Entregado") {
                todosPedidos[index].FechaEntrega = new Date().toISOString();
            }
            
            localStorage.setItem("pedidosHistorial", JSON.stringify(todosPedidos));
        }

        console.log(`✅ Pedido #${idPedido} → ${nuevoEstado}`);

        cerrarModalConfirmacion();
        cerrarModalDetalle();
        cargarPedidos();
    }


    function actualizarContadores() {
        const pendientes = pedidosActuales.filter(p => p.Estado === "Pendiente").length;
        const preparacion = pedidosActuales.filter(p => p.Estado === "EnPreparacion").length;
        const listos = pedidosActuales.filter(p => p.Estado === "Listo").length;

        document.getElementById("contadorPendientes").textContent = pendientes;
        document.getElementById("contadorPreparacion").textContent = preparacion;
        document.getElementById("contadorListos").textContent = listos;
    }


    function obtenerTextoEstado(estado) {
        const textos = {
            "Pendiente": "Pendiente",
            "EnPreparacion": "En Preparación",
            "Listo": "Listo para Servir",
            "Entregado": "Entregado"
        };
        return textos[estado] || estado;
    }


    window.cerrarModalDetalle = function() {
        document.getElementById("modalDetalle").classList.add("oculto");
        pedidoSeleccionado = null;
    };

    window.cerrarModalConfirmacion = function() {
        document.getElementById("modalConfirmacion").classList.add("oculto");
    };

    window.cerrarModalSiClickFuera = function(event) {
        if (event.target.classList.contains("modal-overlay")) {
            cerrarModalDetalle();
        }
    };


    function configurarEventListeners() {
        // Botón refrescar con feedback
        document.getElementById("btnRefrescarPedidos").addEventListener("click", () => {
            const btn = document.getElementById("btnRefrescarPedidos");
            const textoOriginal = btn.textContent;
            btn.textContent = "Actualizando...";
            btn.disabled = true;
            
            setTimeout(() => {
                cargarPedidos();
                btn.textContent = "✓ Actualizado";
                
                setTimeout(() => {
                    btn.textContent = textoOriginal;
                    btn.disabled = false;
                }, 1000);
            }, 300);
        });

        // Filtros
        document.querySelectorAll(".filtro-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("activo"));
                btn.classList.add("activo");
                filtroActivo = btn.dataset.filtro;
                cargarPedidos();
            });
        });
    }


    // Logout con modal
    window.cerrarSesionCocina = function() {
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
    };

}



// =============================================
// =============================================
//   PANTALLA DEL CAJERO
// ================================================
// =============================================
// =============================================
//   CONFIGURACIÓN Y VARIABLES GLOBALES
// =============================================

//const API_URL = "https://tu-api.com/api"; // CAMBIAR por tu URL real

let pedidoSeleccionado = null;
let filtroActual = "pendiente";

// =============================================
//   DATOS SIMULADOS
// =============================================

const pedidosSimulados = [
    {
        idPedido: 1,
        nombreCliente: "Juan Pérez",
        fechaHora: "2025-01-15T14:30:00",
        estado: "Listo",
        total: 8500,
        numeroMesa: 5,
        pagado: false
    },
    {
        idPedido: 2,
        nombreCliente: "María González",
        fechaHora: "2025-01-15T14:45:00",
        estado: "Listo",
        total: 5200,
        numeroMesa: 0,
        pagado: false
    },
    {
        idPedido: 3,
        nombreCliente: "Carlos Rodríguez",
        fechaHora: "2025-01-15T13:20:00",
        estado: "Entregado",
        total: 12000,
        numeroMesa: 8,
        pagado: true
    }
];

const pagosSimulados = [
    {
        idPago: 1,
        monto: 12000,
        metodoPago: "Efectivo",
        fechaPago: "2025-01-15T13:25:00",
        numeroTransaccion: null
    },
    {
        idPago: 2,
        monto: 7800,
        metodoPago: "Tarjeta",
        fechaPago: "2025-01-15T12:10:00",
        numeroTransaccion: "TXN-789012"
    },
    {
        idPago: 3,
        monto: 4500,
        metodoPago: "QR",
        fechaPago: "2025-01-15T11:30:00",
        numeroTransaccion: "QR-456789"
    }
];

// =============================================
//   CARGAR PEDIDOS
// =============================================

async function cargarPedidos() {
    const contenedor = document.getElementById("pedidos-lista");
    
    if (!contenedor) return;

    try {
        // ============================================
        // CONECTAR CON BACKEND (Descomentar cuando conectes)
        // ============================================
        /*
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/Pedidos`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error al cargar pedidos");

        const pedidosBasicos = await response.json();

        // Obtener pagos para verificar cuáles están pagados
        const responsePagos = await fetch(`${API_URL}/Pagos`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        let pedidosPagados = [];
        if (responsePagos.ok) {
            const pagos = await responsePagos.json();
            pedidosPagados = pagos.map(p => p.idPedido);
        }

        // Marcar pedidos como pagados o no
        const pedidos = pedidosBasicos.map(p => ({
            ...p,
            pagado: pedidosPagados.includes(p.idPedido)
        }));
        */

        // ============================================
        // MIENTRAS TANTO, USAR DATOS SIMULADOS:
        // ============================================
        const pedidos = pedidosSimulados;

        // Filtrar
        let pedidosFiltrados;
        if (filtroActual === "pendiente") {
            pedidosFiltrados = pedidos.filter(p => !p.pagado && p.estado !== "Pendiente");
        } else {
            pedidosFiltrados = pedidos;
        }

        renderizarPedidos(pedidosFiltrados);
        actualizarResumen(pedidos);

    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        contenedor.innerHTML = '<div class="mensaje-error">Error al cargar pedidos</div>';
    }
}

// =============================================
//   RENDERIZAR PEDIDOS
// =============================================

function renderizarPedidos(pedidos) {
    const contenedor = document.getElementById("pedidos-lista");

    if (pedidos.length === 0) {
        contenedor.innerHTML = '<div class="mensaje-vacio">No hay pedidos pendientes</div>';
        return;
    }

    contenedor.innerHTML = "";

    pedidos.forEach(pedido => {
        const card = crearCardPedido(pedido);
        contenedor.appendChild(card);
    });
}

// =============================================
//   CREAR CARD DE PEDIDO
// =============================================

function crearCardPedido(pedido) {
    const card = document.createElement("div");
    card.className = "pedido-card-caja";

    const tipoPedido = pedido.numeroMesa > 0 
        ? `Mesa ${pedido.numeroMesa}` 
        : "Para llevar";

    const estadoPago = pedido.pagado 
        ? '<span class="badge-pagado">Pagado</span>' 
        : '<span class="badge-pendiente">Pendiente</span>';

    card.innerHTML = `
        <div class="card-header-caja">
            <div>
                <h3>Pedido #${pedido.idPedido}</h3>
                <span class="tipo-pedido">${tipoPedido}</span>
            </div>
            ${estadoPago}
        </div>

        <div class="card-body-caja">
            <div class="info-linea">
                <span class="label">Cliente:</span>
                <span class="valor">${pedido.nombreCliente || 'Sin nombre'}</span>
            </div>
            <div class="info-linea">
                <span class="label">Estado:</span>
                <span class="valor">${pedido.estado}</span>
            </div>
            <div class="info-linea total-linea">
                <span class="label">Total:</span>
                <span class="valor-monto">$${pedido.total.toFixed(2)}</span>
            </div>
        </div>

        ${!pedido.pagado ? `
            <div class="card-footer-caja">
                <button class="btn-registrar-pago" onclick="abrirModalPago(${pedido.idPedido})">
                    Registrar Pago
                </button>
            </div>
        ` : ''}
    `;

    return card;
}

// =============================================
//   ACTUALIZAR RESUMEN
// =============================================

function actualizarResumen(pedidos) {
    const pendientes = pedidos.filter(p => !p.pagado).length;
    const totalDia = pedidos.reduce((sum, p) => p.pagado ? sum + p.total : sum, 0);
    const procesados = pedidos.filter(p => p.pagado).length;

    const elemPendientes = document.getElementById("total-pendientes");
    const elemTotalDia = document.getElementById("total-dia");
    const elemProcesados = document.getElementById("total-procesados");

    if (elemPendientes) elemPendientes.textContent = pendientes;
    if (elemTotalDia) elemTotalDia.textContent = `$${totalDia.toFixed(2)}`;
    if (elemProcesados) elemProcesados.textContent = procesados;
}

// =============================================
//   ABRIR MODAL DE PAGO
// =============================================

function abrirModalPago(idPedido) {
    const pedido = pedidosSimulados.find(p => p.idPedido === idPedido);
    
    if (!pedido) {
        alert("Pedido no encontrado");
        return;
    }

    pedidoSeleccionado = pedido;

    document.getElementById("modal-pedido-num").textContent = `#${pedido.idPedido}`;
    document.getElementById("modal-cliente-nom").textContent = pedido.nombreCliente || 'Sin nombre';
    document.getElementById("modal-monto-total").textContent = `$${pedido.total.toFixed(2)}`;

    // Resetear form
    document.getElementById("metodo-pago").value = "";
    document.getElementById("numero-transaccion").value = "";
    document.getElementById("campo-transaccion").classList.add("oculto");

    document.getElementById("modal-pago").classList.remove("oculto");
}

// =============================================
//   CERRAR MODAL
// =============================================

function cerrarModalPago() {
    document.getElementById("modal-pago").classList.add("oculto");
    pedidoSeleccionado = null;
}

// =============================================
//   MOSTRAR CAMPO TRANSACCIÓN
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    const selectMetodo = document.getElementById("metodo-pago");
    
    if (selectMetodo) {
        selectMetodo.addEventListener("change", (e) => {
            const metodo = e.target.value;
            const campoTransaccion = document.getElementById("campo-transaccion");
            
            if (metodo === "Tarjeta" || metodo === "QR") {
                campoTransaccion.classList.remove("oculto");
            } else {
                campoTransaccion.classList.add("oculto");
            }
        });
    }
});

// =============================================
//   CONFIRMAR PAGO
// =============================================

async function confirmarPago() {
    if (!pedidoSeleccionado) return;

    const metodo = document.getElementById("metodo-pago").value;
    
    if (!metodo) {
        alert("Seleccione un método de pago");
        return;
    }

    let numeroTransaccion = document.getElementById("numero-transaccion").value.trim();

    // Validar transacción para Tarjeta y QR
    if ((metodo === "Tarjeta" || metodo === "QR") && !numeroTransaccion) {
        alert("Ingrese el número de transacción");
        return;
    }

    try {
        // ============================================
        // CONECTAR CON BACKEND (Descomentar cuando conectes)
        // ============================================
        /*
        const token = localStorage.getItem("token");

        // Crear objeto de pago
        const pago = {
            idPedido: pedidoSeleccionado.idPedido,
            monto: pedidoSeleccionado.total,
            metodoPago: metodo,
            fechaPago: new Date().toISOString(),
            numeroTransaccion: numeroTransaccion || null
        };

        // Registrar pago
        const response = await fetch(`${API_URL}/Pagos`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pago)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al registrar pago");
        }
        */

        // ============================================
        // SIMULACIÓN:
        // ============================================
        pedidoSeleccionado.pagado = true;

        cerrarModalPago();
        await cargarPedidos();
        mostrarNotificacion("Pago registrado correctamente");

    } catch (error) {
        console.error("Error al confirmar pago:", error);
        alert("Error al registrar pago: " + error.message);
    }
}

// =============================================
//   CARGAR HISTORIAL DE PAGOS
// =============================================

async function cargarHistorial() {
    const tbody = document.getElementById("historial-pagos");
    
    if (!tbody) return;

    try {
        // ============================================
        // CONECTAR CON BACKEND (Descomentar cuando conectes)
        // ============================================
        /*
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/Pagos`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error al cargar historial");

        const pagos = await response.json();
        */

        // ============================================
        // MIENTRAS TANTO, USAR DATOS SIMULADOS:
        // ============================================
        const pagos = pagosSimulados;

        renderizarHistorial(pagos);
        calcularTotalRecaudado(pagos);

    } catch (error) {
        console.error("Error al cargar historial:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="mensaje-error">Error al cargar historial</td></tr>';
    }
}

// =============================================
//   RENDERIZAR HISTORIAL
// =============================================

function renderizarHistorial(pagos) {
    const tbody = document.getElementById("historial-pagos");

    if (pagos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="mensaje-vacio">No hay pagos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = "";

    pagos.forEach(pago => {
        const fila = document.createElement("tr");
        
        const fecha = new Date(pago.fechaPago);
        const fechaFormato = fecha.toLocaleDateString('es-AR');
        const horaFormato = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

        fila.innerHTML = `
            <td>${pago.idPago}</td>
            <td>${fechaFormato} ${horaFormato}</td>
            <td><span class="badge-metodo badge-${pago.metodoPago.toLowerCase()}">${pago.metodoPago}</span></td>
            <td class="monto-cell">$${pago.monto.toFixed(2)}</td>
            <td>${pago.numeroTransaccion || '-'}</td>
        `;

        tbody.appendChild(fila);
    });
}

// =============================================
//   CALCULAR TOTAL RECAUDADO
// =============================================

function calcularTotalRecaudado(pagos) {
    const total = pagos.reduce((sum, p) => sum + p.monto, 0);
    const elem = document.getElementById("total-recaudado");
    
    if (elem) {
        elem.textContent = `$${total.toFixed(2)}`;
    }
}

// =============================================
//   FILTROS
// =============================================

function configurarFiltros() {
    const botonesFiltro = document.querySelectorAll('.cajero-filtros .filtro-btn');

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            const filtro = btn.dataset.filtro;
            
            if (filtro) {
                filtroActual = filtro;
                cargarPedidos();
            }

            const metodo = btn.dataset.metodo;
            
            if (metodo) {
                filtrarHistorialPorMetodo(metodo);
            }
        });
    });
}

// =============================================
//   FILTRAR HISTORIAL POR MÉTODO
// =============================================

function filtrarHistorialPorMetodo(metodo) {
    let pagosFiltrados;
    
    if (metodo === "todos") {
        pagosFiltrados = pagosSimulados;
    } else {
        pagosFiltrados = pagosSimulados.filter(p => p.metodoPago === metodo);
    }

    renderizarHistorial(pagosFiltrados);
    calcularTotalRecaudado(pagosFiltrados);
}

// =============================================
//   NOTIFICACIÓN
// =============================================

function mostrarNotificacion(mensaje) {
    const notif = document.createElement("div");
    notif.className = "notificacion mostrar";
    notif.textContent = mensaje;
    
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.remove("mostrar");
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// =============================================
//   CERRAR SESIÓN
// =============================================

function cerrarSesion() {
    if (confirm("¿Cerrar sesión?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("usuario");
        window.location.href = "../../admin-login.html";
    }
}

// =============================================
//   INICIALIZACIÓN
// =============================================

document.addEventListener("DOMContentLoaded", () => {
    // ============================================
    // COMENTADO MIENTRAS NO HAY BACKEND
    // ============================================
    /*
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../../admin-login.html";
        return;
    }
    */

    if (document.getElementById("pedidos-lista")) {
        cargarPedidos();
        configurarFiltros();
        setInterval(cargarPedidos, 30000);
    }

    if (document.getElementById("historial-pagos")) {
        cargarHistorial();
        configurarFiltros();
    }
});