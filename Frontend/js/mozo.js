
// ============================================================
//  PANEL DEL MOZO
// ============================================================
// =============================================
//   CONFIGURACIÓN Y VARIABLES GLOBALES
// =============================================

const API_URL = "https://tu-api.com/api"; // CAMBIAR por tu URL real

let pedidoSeleccionado = null;
let filtroActual = "Listo";

// =============================================
//   DATOS SIMULADOS (Provisorios para testing)
// =============================================

const pedidosSimulados = [
    {
        idPedido: 1,
        nombreCliente: "Juan Pérez",
        fechaHora: "2025-01-15T14:30:00",
        estado: "Entregado",
        total: 8500,
        numeroMesa: 5,
        detalles: [
            {
                idDetalle: 1,
                idPlato: 1,
                nombrePlato: "Hamburguesa Clásica",
                cantidad: 2,
                precioUnitario: 3500,
                subtotal: 7000,
                observaciones: "Sin cebolla"
            },
            {
                idDetalle: 2,
                idPlato: 3,
                nombrePlato: "Coca-Cola 500ml",
                cantidad: 1,
                precioUnitario: 1500,
                subtotal: 1500,
                observaciones: null
            }
        ]
    },
    {
        idPedido: 2,
        nombreCliente: "María González",
        fechaHora: "2025-01-15T14:45:00",
        estado: "Listo",
        total: 5200,
        numeroMesa: 0,
        detalles: [
            {
                idDetalle: 3,
                idPlato: 2,
                nombrePlato: "McPollo Deluxe",
                cantidad: 1,
                precioUnitario: 3200,
                subtotal: 3200,
                observaciones: null
            },
            {
                idDetalle: 4,
                idPlato: 4,
                nombrePlato: "Papas Grandes",
                cantidad: 1,
                precioUnitario: 2000,
                subtotal: 2000,
                observaciones: "Extra sal"
            }
        ]
    },
    {
        idPedido: 3,
        nombreCliente: "Carlos Rodríguez",
        fechaHora: "2025-01-15T13:20:00",
        estado: "Entregado",
        total: 12000,
        numeroMesa: 8,
        detalles: [
            {
                idDetalle: 5,
                idPlato: 1,
                nombrePlato: "Hamburguesa Clásica",
                cantidad: 3,
                precioUnitario: 3500,
                subtotal: 10500,
                observaciones: null
            }
        ]
    },
    {
        idPedido: 4,
        nombreCliente: "Ana Martínez",
        fechaHora: "2025-01-15T14:50:00",
        estado: "En preparación",
        total: 6800,
        numeroMesa: 3,
        detalles: [
            {
                idDetalle: 7,
                idPlato: 5,
                nombrePlato: "Sundae de Chocolate",
                cantidad: 2,
                precioUnitario: 1100,
                subtotal: 2200,
                observaciones: null
            }
        ]
    }
];

const mesasSimuladas = [
    { idMesa: 1, numero: 1, estado: "Libre", capacidad: 2, activa: true },
    { idMesa: 2, numero: 2, estado: "Ocupada", capacidad: 4, activa: true },
    { idMesa: 3, numero: 3, estado: "Ocupada", capacidad: 4, activa: true },
    { idMesa: 4, numero: 4, estado: "Libre", capacidad: 6, activa: true },
    { idMesa: 5, numero: 5, estado: "Ocupada", capacidad: 2, activa: true },
    { idMesa: 6, numero: 6, estado: "Libre", capacidad: 4, activa: true },
    { idMesa: 7, numero: 7, estado: "Reservada", capacidad: 8, activa: true },
    { idMesa: 8, numero: 8, estado: "Ocupada", capacidad: 6, activa: true }
];

// =============================================
//   CARGAR PEDIDOS - ADAPTADO AL BACKEND REAL
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
        
        // 1. OBTENER LISTA BÁSICA DE PEDIDOS
        const response = await fetch(`${API_URL}/Pedidos`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error al cargar pedidos");

        const pedidosBasicos = await response.json();

        // 2. PARA CADA PEDIDO, OBTENER DETALLES COMPLETOS
        const pedidosCompletos = await Promise.all(
            pedidosBasicos.map(async (pedidoBasico) => {
                try {
                    const detalleResponse = await fetch(`${API_URL}/Pedidos/${pedidoBasico.idPedido}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (detalleResponse.ok) {
                        const pedidoCompleto = await detalleResponse.json();
                        
                        // Si el backend devuelve detalles, usarlos
                        if (pedidoCompleto.detalles && pedidoCompleto.detalles.length > 0) {
                            return pedidoCompleto;
                        }
                    }

                    // Si no hay detalles, usar el básico con array vacío
                    return {
                        ...pedidoBasico,
                        detalles: []
                    };

                } catch (error) {
                    console.error(`Error al obtener detalles del pedido ${pedidoBasico.idPedido}:`, error);
                    return {
                        ...pedidoBasico,
                        detalles: []
                    };
                }
            })
        );

        const pedidos = pedidosCompletos;
        */

        // ============================================
        // MIENTRAS TANTO, USAR DATOS SIMULADOS:
        // ============================================
        const pedidos = pedidosSimulados;

        // Filtrar según estado actual
        let pedidosFiltrados;
        
        if (filtroActual === "Todos") {
            pedidosFiltrados = pedidos;
        } else {
            pedidosFiltrados = pedidos.filter(p => p.estado === filtroActual);
        }

        renderizarPedidos(pedidosFiltrados);

    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        contenedor.innerHTML = '<div class="mensaje-error">Error al cargar pedidos. Intente nuevamente.</div>';
    }
}

// =============================================
//   RENDERIZAR PEDIDOS EN PANTALLA
// =============================================

function renderizarPedidos(pedidos) {
    const contenedor = document.getElementById("pedidos-lista");

    if (pedidos.length === 0) {
        contenedor.innerHTML = '<div class="mensaje-vacio">No hay pedidos en este estado</div>';
        return;
    }

    contenedor.innerHTML = "";

    pedidos.forEach(pedido => {
        const fila = crearCardPedido(pedido);
        contenedor.appendChild(fila);
    });
}

// =============================================
//   CREAR FILA DE PEDIDO
// =============================================

function crearCardPedido(pedido) {
    const fila = document.createElement("div");
    fila.className = "pedido-fila";

    const tipoPedido = pedido.numeroMesa > 0 
        ? `Mesa ${pedido.numeroMesa}` 
        : "Para llevar";

    const tiempoTranscurrido = calcularTiempoTranscurrido(pedido.fechaHora);

    // Validar si hay detalles
    const detalles = pedido.detalles || [];
    const itemsHTML = detalles.length > 0 
        ? detalles.map(detalle => `
            <div class="item-linea">
                <span class="item-cant">${detalle.cantidad}x</span>
                <span class="item-nom">${detalle.nombrePlato || 'Producto'}</span>
                ${detalle.observaciones ? `<span class="item-obs">(${detalle.observaciones})</span>` : ''}
            </div>
        `).join('')
        : '<div class="item-linea">Sin detalles disponibles</div>';

    fila.innerHTML = `
        <div class="pedido-col pedido-numero">
            <div class="label-numero">#${pedido.idPedido}</div>
            <div class="estado-badge estado-${pedido.estado.toLowerCase().replace(' ', '-')}">${pedido.estado}</div>
        </div>

        <div class="pedido-col pedido-info-cliente">
            <div class="info-row">
                <span class="info-label">Cliente:</span>
                <span class="info-valor">${pedido.nombreCliente || 'Sin nombre'}</span>
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

// =============================================
//   CALCULAR TIEMPO TRANSCURRIDO
// =============================================

function calcularTiempoTranscurrido(fechaHora) {
    const ahora = new Date();
    const fecha = new Date(fechaHora);
    const diffMs = ahora - fecha;
    const diffMin = Math.floor(diffMs / 1000 / 60);

    if (diffMin < 1) return "Hace un momento";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    
    const diffHoras = Math.floor(diffMin / 60);
    const minRestantes = diffMin % 60;
    
    return `Hace ${diffHoras}h ${minRestantes}min`;
}

// =============================================
//   ABRIR MODAL DE CONFIRMACIÓN
// =============================================

function abrirModalEntrega(idPedido) {
    const pedido = pedidosSimulados.find(p => p.idPedido === idPedido);
    
    if (!pedido) {
        alert("Pedido no encontrado");
        return;
    }

    pedidoSeleccionado = pedido;

    document.getElementById("modal-pedido-id").textContent = `#${pedido.idPedido}`;
    document.getElementById("modal-cliente").textContent = pedido.nombreCliente || 'Sin nombre';
    document.getElementById("modal-mesa").textContent = pedido.numeroMesa > 0 
        ? `Mesa ${pedido.numeroMesa}` 
        : "Para llevar";

    document.getElementById("modal-confirmar").classList.remove("oculto");
}

// =============================================
//   CERRAR MODAL
// =============================================

function cerrarModal() {
    document.getElementById("modal-confirmar").classList.add("oculto");
    pedidoSeleccionado = null;
}

// =============================================
//   CONFIRMAR ENTREGA - ADAPTADO AL BACKEND
// =============================================

async function confirmarEntrega() {
    if (!pedidoSeleccionado) return;

    try {
        // ============================================
        // CONECTAR CON BACKEND (Descomentar cuando conectes)
        // ============================================
        /*
        const token = localStorage.getItem("token");
        
        // Obtener el pedido completo actual
        const responsePedido = await fetch(`${API_URL}/Pedidos/${pedidoSeleccionado.idPedido}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!responsePedido.ok) throw new Error("Error al obtener pedido");

        const pedidoActual = await responsePedido.json();

        // Crear objeto MÍNIMO que acepta el backend
        // Según tu PedidoService, solo actualiza Estado y Total
        const pedidoActualizado = {
            idPedido: pedidoActual.idPedido,
            nombreCliente: pedidoActual.nombreCliente || "",
            fechaHora: pedidoActual.fechaHora,
            estado: "Entregado",  // ← ÚNICO CAMBIO
            total: pedidoActual.total,
            numeroMesa: pedidoActual.numeroMesa || 0
        };

        // Enviar actualización
        const responseUpdate = await fetch(`${API_URL}/Pedidos/${pedidoSeleccionado.idPedido}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedidoActualizado)
        });

        if (!responseUpdate.ok) {
            const errorData = await responseUpdate.json();
            throw new Error(errorData.message || "Error al actualizar pedido");
        }
        */

        // ============================================
        // SIMULACIÓN (Mientras no conectes al backend):
        // ============================================
        pedidoSeleccionado.estado = "Entregado";

        cerrarModal();
        await cargarPedidos();
        mostrarNotificacion("Pedido marcado como entregado correctamente");

    } catch (error) {
        console.error("Error al confirmar entrega:", error);
        alert("Error al confirmar entrega: " + error.message);
    }
}

// =============================================
//   CARGAR MESAS
// =============================================

async function cargarMesas() {
    const contenedor = document.getElementById("mesas-lista");
    
    if (!contenedor) return;

    try {
        // ============================================
        // CONECTAR CON BACKEND (Descomentar cuando conectes)
        // ============================================
        /*
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/Mesas`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error al cargar mesas");

        const mesas = await response.json();
        */

        // ============================================
        // MIENTRAS TANTO, USAR DATOS SIMULADOS:
        // ============================================
        const mesas = mesasSimuladas;

        renderizarMesas(mesas);

    } catch (error) {
        console.error("Error al cargar mesas:", error);
        contenedor.innerHTML = '<div class="mensaje-error">Error al cargar mesas. Intente nuevamente.</div>';
    }
}

// =============================================
//   RENDERIZAR MESAS
// =============================================

function renderizarMesas(mesas) {
    const contenedor = document.getElementById("mesas-lista");

    if (mesas.length === 0) {
        contenedor.innerHTML = '<div class="mensaje-vacio">No hay mesas registradas</div>';
        return;
    }

    contenedor.innerHTML = "";

    mesas.forEach(mesa => {
        const card = crearCardMesa(mesa);
        contenedor.appendChild(card);
    });
}

// =============================================
//   CREAR TARJETA DE MESA
// =============================================

function crearCardMesa(mesa) {
    const card = document.createElement("div");
    card.className = `mesa-card mesa-${mesa.estado.toLowerCase()}`;

    card.innerHTML = `
        <div class="mesa-numero">Mesa ${mesa.numero}</div>
        <div class="mesa-estado">${mesa.estado}</div>
        <div class="mesa-capacidad">Capacidad: ${mesa.capacidad || 'No especificada'}</div>
    `;

    return card;
}

// =============================================
//   FILTROS DE PEDIDOS
// =============================================

function configurarFiltrosPedidos() {
    const botonesFiltro = document.querySelectorAll('.mozo-filtros .filtro-btn');

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            const estado = btn.dataset.estado;
            filtroActual = estado;

            cargarPedidos();
        });
    });
}

// =============================================
//   FILTROS DE MESAS
// =============================================

function configurarFiltrosMesas() {
    const botonesFiltro = document.querySelectorAll('.mozo-filtros .filtro-btn');

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            const filtro = btn.dataset.filtro;

            let mesasFiltradas;
            if (filtro === "Todas") {
                mesasFiltradas = mesasSimuladas;
            } else {
                mesasFiltradas = mesasSimuladas.filter(m => m.estado === filtro);
            }

            renderizarMesas(mesasFiltradas);
        });
    });
}

// =============================================
//   NOTIFICACIÓN TEMPORAL
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
        configurarFiltrosPedidos();
        setInterval(cargarPedidos, 30000);
    }

    if (document.getElementById("mesas-lista")) {
        cargarMesas();
        configurarFiltrosMesas();
    }
});




