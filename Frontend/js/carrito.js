// ===============================
//  SISTEMA DE CARRITO DE COMPRAS
// ===============================

const API_PEDIDOS_URL = "http://localhost:5151/api/Pedidos/publico";
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ====================
// Mostrar carrito
// ====================
function cargarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalPrecio = document.getElementById("total-precio");
    const nombreInput = document.getElementById("nombre-cliente");

    // Cargar nombre guardado
    const nombreGuardado = localStorage.getItem("nombreCliente");
    if (nombreGuardado) {
        nombreInput.value = nombreGuardado;
    }

    lista.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding:40px; color:#999;">
                <p>🛒 Tu carrito está vacío</p>
                <a href="menu.html" style="color:#ff6b35; text-decoration:none;">Ver menú</a>
            </div>
        `;
        totalPrecio.textContent = "0.00";
        return;
    }

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        // CORRECCIÓN: Procesar la ruta de la imagen correctamente
        const imagenURL = item.imagenURL || item.img || 'default.jpg';
        const rutaImagen = imagenURL.startsWith('http') 
            ? imagenURL 
            : `../${imagenURL}`;

        const div = document.createElement("div");
        div.className = "carrito-item";
        div.innerHTML = `
            <img src="${rutaImagen}" alt="${item.nombre}">
            <div class="carrito-info">
                <h3>${item.nombre}</h3>
                <p>$${item.precio.toFixed(2)} c/u</p>
                <p>Cant: ${item.cantidad} | Subtotal: $${subtotal.toFixed(2)}</p>
            </div>
            <div class="carrito-controles">
                <button class="btn-cantidad" data-index="${index}" data-action="sumar">+</button>
                <button class="btn-cantidad" data-index="${index}" data-action="restar">−</button>
                <button class="btn-eliminar" data-index="${index}" data-action="eliminar">X</button>
            </div>
        `;
        lista.appendChild(div);
    });

    totalPrecio.textContent = total.toFixed(2);
    agregarEventListeners();
}
// ====================
// Botones +, −, X
// ====================
function agregarEventListeners() {
    document.querySelectorAll('[data-action="sumar"]').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            if (carrito[index]) {
                carrito[index].cantidad++;
                guardarCarrito();
                cargarCarrito();
            }
        };
    });

    document.querySelectorAll('[data-action="restar"]').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            if (carrito[index]) {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                    guardarCarrito();
                    cargarCarrito();
                }
            }
        };
    });

    document.querySelectorAll('[data-action="eliminar"]').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const index = parseInt(btn.dataset.index);
            if (confirm("¿Eliminar este producto del carrito?")) {
                carrito.splice(index, 1);
                guardarCarrito();
                cargarCarrito();
            }
        };
    });
}

// ====================
// Guardar carrito
// ====================
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ====================
// Confirmar pedido - SIN ALERT, REDIRIGIR DIRECTO
// ====================
document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();

    const btnConfirmar = document.getElementById("btn-confirmar");
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", async () => {
            if (carrito.length === 0) {
                alert("❌ Tu pedido está vacío.");
                return;
            }

            const nombreCliente = document.getElementById("nombre-cliente").value.trim();
            if (!nombreCliente) {
                alert("❌ Ingresá tu nombre.");
                document.getElementById("nombre-cliente").focus();
                return;
            }

            const observacionesGenerales = document.getElementById("observaciones-generales").value.trim();
            
            // Guardar datos para la pantalla de pago
            localStorage.setItem("nombreCliente", nombreCliente);
            localStorage.setItem("observacionesGenerales", observacionesGenerales);
            
            // Redirigir SIN mostrar alert
            window.location.href = "pago.html";
        });
    }

    // Guardar nombre al escribir
    const nombreInput = document.getElementById("nombre-cliente");
    if (nombreInput) {
        nombreInput.addEventListener("blur", () => {
            const nombre = nombreInput.value.trim();
            if (nombre) {
                localStorage.setItem("nombreCliente", nombre);
            }
        });
    }
});