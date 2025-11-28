// ===============================
//  PANTALLA DE CONFIRMACIÓN
// ===============================

let segundos = 30;

// ====================
// Cargar datos al abrir la página
// ====================
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosConfirmacion();
    iniciarContador();
});

// ====================
// Cargar todos los datos del pedido
// ====================
function cargarDatosConfirmacion() {
    // CÓDIGO DE PEDIDO
    const idPedido = localStorage.getItem("ultimoPedidoId") || "N/A";
    document.getElementById("codigo-pedido").textContent = idPedido;

    // NOMBRE DEL CLIENTE
    const nombreCliente = localStorage.getItem("nombreCliente") || "Cliente";
    document.getElementById("nombre-cliente-confirmacion").textContent = nombreCliente;

    // MÉTODO DE PAGO
    const metodoPago = localStorage.getItem("metodoPago") || "No especificado";
    document.getElementById("pago-metodo").textContent = metodoPago;

    // TIPO DE PEDIDO (Local o Para Llevar)
    const tipoPedido = localStorage.getItem("tipoPedido") || "Para Llevar";
    document.getElementById("tipo-pedido-confirmacion").textContent = tipoPedido;

    // MESA (solo si es "Local")
    if (tipoPedido === "Local") {
        const mesa = localStorage.getItem("mesaSeleccionada") || "10";
        document.getElementById("mesa-confirmacion").textContent = `Mesa ${mesa}`;
        document.getElementById("mesa-item").style.display = "flex";
    }

    // PRODUCTOS
    const carrito = JSON.parse(localStorage.getItem("carritoOriginal")) || [];
    const listaProductos = document.getElementById("productos-confirmacion");
    let totalPagado = 0;

    if (carrito.length > 0) {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalPagado += subtotal;

            const li = document.createElement("li");
            li.textContent = `${item.cantidad}x ${item.nombre} - $${subtotal.toFixed(2)}`;
            listaProductos.appendChild(li);
        });
    } else {
        listaProductos.innerHTML = "<li>No hay productos</li>";
    }

    // TOTAL PAGADO
    document.getElementById("total-pagado").textContent = `$${totalPagado.toFixed(2)}`;

    // OBSERVACIONES
    const observaciones = localStorage.getItem("observacionesGenerales");
    if (observaciones && observaciones.trim() !== "") {
        document.getElementById("observaciones-confirmacion").textContent = observaciones;
        document.getElementById("observaciones-box").style.display = "block";
    }
}

// ====================
// Contador de redirección
// ====================
function iniciarContador() {
    const contadorElement = document.getElementById("contador");
    
    const interval = setInterval(() => {
        segundos--;
        contadorElement.textContent = segundos;
        
        if (segundos <= 0) {
            clearInterval(interval);
            volverInicio();
        }
    }, 1000);
}

// ====================
// Volver al inicio (menú)
// ====================
function volverInicio() {
    // Limpiar datos temporales (EXCEPTO tipoPedido y mesaSeleccionada por si se necesita)
    localStorage.removeItem("ultimoPedidoId");
    localStorage.removeItem("metodoPago");
    localStorage.removeItem("observacionesGenerales");
    localStorage.removeItem("carritoOriginal");
    
    // Redirigir al menú
    window.location.href = "../index.html";
}