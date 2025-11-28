// ===============================
//  SISTEMA DE MÉTODO DE PAGO
// ===============================

const API_PEDIDOS_URL = "http://localhost:5151/api/Pedidos/publico";
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let metodoPagoSeleccionado = null;

// ====================
// Cargar datos al abrir la pantalla
// ====================
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosCliente();
    configurarBotones();
});

// ====================
// Cargar nombre del cliente
// ====================
function cargarDatosCliente() {
    const nombreCliente = localStorage.getItem("nombreCliente") || "Usuario";
    document.getElementById("nombre-usuario").textContent = nombreCliente;
}

// ====================
// Configurar botones de método de pago
// ====================
function configurarBotones() {
    // Efectivo
    document.querySelector('[data-metodo="efectivo"]').addEventListener("click", () => {
        abrirModalEfectivo();
    });

    // Tarjeta
    document.querySelector('[data-metodo="tarjeta"]').addEventListener("click", () => {
        abrirModalTarjeta();
    });

    // QR
    document.querySelector('[data-metodo="qr"]').addEventListener("click", () => {
        abrirModalQR();
    });
}

// ====================
// MODAL EFECTIVO
// ====================
function abrirModalEfectivo() {
    metodoPagoSeleccionado = "Efectivo";
    mostrarResumenEnModal("efectivo");
    document.getElementById("modal-efectivo").classList.remove("oculto");
}

function cerrarModalEfectivo() {
    document.getElementById("modal-efectivo").classList.add("oculto");
}

function confirmarEfectivo() {
    enviarPedidoBackend("Efectivo");
}

// ====================
// MODAL TARJETA
// ====================
function abrirModalTarjeta() {
    metodoPagoSeleccionado = "Tarjeta";
    mostrarResumenEnModal("tarjeta");
    document.getElementById("modal-tarjeta").classList.remove("oculto");
}

function cerrarModalTarjeta() {
    document.getElementById("modal-tarjeta").classList.add("oculto");
}

function confirmarTarjeta() {
    enviarPedidoBackend("Tarjeta");
}

// ====================
// MODAL QR
// ====================
function abrirModalQR() {
    metodoPagoSeleccionado = "QR";
    mostrarResumenEnModal("qr");
    document.getElementById("modal-qr").classList.remove("oculto");
}

function cerrarModalQR() {
    document.getElementById("modal-qr").classList.add("oculto");
}

function confirmarQR() {
    enviarPedidoBackend("QR");
    window.location.href = "confirmacion.html";
}

// ====================
// Cerrar modal genérico
// ====================
function cerrarModal(modalId) {
    document.getElementById(modalId).classList.add("oculto");
}

// ====================
// Mostrar resumen en los modales
// ====================
function mostrarResumenEnModal(metodo) {
    const listaId = `lista-${metodo}`;
    const totalId = `total-${metodo}`;
    
    const lista = document.getElementById(listaId);
    const total = document.getElementById(totalId);
    
    if (!lista || !total) return;
    
    lista.innerHTML = "";
    let totalPrecio = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalPrecio += subtotal;
        
        const li = document.createElement("li");
        li.textContent = `${item.cantidad}x ${item.nombre} - $${subtotal.toFixed(2)}`;
        lista.appendChild(li);
    });
    
    total.textContent = totalPrecio.toFixed(2);
}

// ====================
// Enviar pedido al backend
// ====================
async function enviarPedidoBackend(metodoPago) {
    const nombreCliente = localStorage.getItem("nombreCliente") || "Cliente";
    const observacionesGenerales = localStorage.getItem("observacionesGenerales") || "";
    const mesaSeleccionada = parseInt(localStorage.getItem("mesaSeleccionada")) || 10;
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const pedido = {
        NombreCliente: nombreCliente,
        FechaHora: new Date().toISOString(),
        Estado: "Pendiente",
        Total: total,
        NumeroMesa: mesaSeleccionada,
        Pagos: [
            {
                MetodoPago: metodoPago,
                Monto: total,
                FechaPago: new Date().toISOString()
            }
        ],
        Detalles: carrito.map(item => ({
            IdPlato: item.idPlato,
            Cantidad: item.cantidad,
            PrecioUnitario: item.precio,
            Subtotal: item.precio * item.cantidad,
            Observaciones: observacionesGenerales
        }))
    };

    console.log(" Enviando pedido con método:", metodoPago, pedido);

    try {
        const res = await fetch(API_PEDIDOS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.title || data.message || "Error al procesar el pedido");
        }

        console.log(" Pedido confirmado:", data);

        // Guardar ID del pedido
        localStorage.setItem("ultimoPedidoId", data.idPedido || data.IdPedido);
        localStorage.setItem("metodoPago", metodoPago);
        localStorage.setItem("carritoOriginal", JSON.stringify(carrito));

        // Limpiar carrito
        localStorage.removeItem("carrito");

        // Redirigir a confirmación
        window.location.href = "confirmacion.html";

    } catch (err) {
        console.error(" Error:", err);
        alert(` Error al procesar el pago:\n\n${err.message}`);
    }
}