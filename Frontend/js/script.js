// Evitar retroceso en navegadores
history.pushState(null, "", location.href);
window.onpopstate = () => {
    history.pushState(null, "", location.href);
};




// -----------------------------
// DATOS SIMULADOS
// -----------------------------
const categorias = [
    { id: 1, nombre: "Hamburguesas" },
    { id: 2, nombre: "Papas" },
    { id: 3, nombre: "Bebidas" },
    { id: 4, nombre: "Postres" }
];

const productos = [
    { id: 1, categoria: 1, nombre: "Doble Cuarto de Libra", precio: 3500, img: "../img/burger1.jpg", sugerido: true },
    { id: 2, categoria: 1, nombre: "McPollo Deluxe", precio: 3200, img: "../img/burger2.jpg", sugerido: false },
    { id: 3, categoria: 2, nombre: "Papas Grandes", precio: 1500, img: "../img/fritas.jpg", sugerido: true },
    { id: 4, categoria: 3, nombre: "Coca-Cola 500ml", precio: 900, img: "../img/coca.jpg", sugerido: false },
    { id: 5, categoria: 4, nombre: "Sundae de Chocolate", precio: 1100, img: "../img/sundae.jpg", sugerido: false }
];

// -----------------------------
// CARGA DE CATEGORÍAS
// -----------------------------
function cargarCategorias() {
    const contenedor = document.getElementById("lista-categorias");

    categorias.forEach(cat => {
        const btn = document.createElement("div");
        btn.className = "categoria-btn";
        btn.textContent = cat.nombre;

        btn.onclick = () => {
            filtrarPorCategoria(cat.id);
            document.getElementById("sidebar").classList.remove("sidebar-open");
        };

        contenedor.appendChild(btn);
    });
}

// -----------------------------
// CARGA DE PRODUCTOS
// -----------------------------
function cargarProductos() {
    const contenedor = document.getElementById("lista-productos");

    productos.forEach(prod => {
        contenedor.appendChild(crearCardProducto(prod));
    });
}

// -----------------------------
// PRODUCTOS SUGERIDOS
// -----------------------------
function cargarSugerencias() {
    const contenedor = document.getElementById("sugerencias");

    productos
        .filter(p => p.sugerido)
        .forEach(prod => {
            contenedor.appendChild(crearCardProducto(prod));
        });
}

// -----------------------------
// CREAR TARJETA
// -----------------------------
function crearCardProducto(prod) {
    const div = document.createElement("div");
    div.className = "item-card";

    div.innerHTML = `
        <img src="${prod.img}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>$${prod.precio}</p>
    `;

    div.onclick = () => {
        window.location.href = `detalle.html?id=${prod.id}`;
    };

    return div;
}

// -----------------------------
// FILTRO POR CATEGORÍA
// -----------------------------
function filtrarPorCategoria(catId) {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    productos
        .filter(p => p.categoria === catId)
        .forEach(prod => contenedor.appendChild(crearCardProducto(prod)));
}

// -----------------------------
// INICIALIZAR (solo en menu.html)
// -----------------------------
if (document.body.classList.contains("pantalla-menu")) {
    cargarCategorias();
    cargarSugerencias();
    cargarProductos();
}


// -----------------------------
// DETALLE DEL PRODUCTO
// -----------------------------
if (document.body.classList.contains("pantalla-detalle")) {

    // Obtener id desde la URL
    const params = new URLSearchParams(window.location.search);
    const idProducto = parseInt(params.get("id"));

    // Buscar producto
    const producto = productos.find(p => p.id === idProducto);

    // Cargar datos en pantalla
    document.getElementById("detalle-img").src = producto.img;
    document.getElementById("detalle-nombre").textContent = producto.nombre;
    document.getElementById("detalle-descripcion").textContent = "Una deliciosa opción para disfrutar."; // texto simulado
    document.getElementById("detalle-precio").textContent = producto.precio;

    let cantidad = 1;

    // Botón sumar
    document.getElementById("btn-sumar").onclick = () => {
        cantidad++;
        document.getElementById("cantidad").textContent = cantidad;
    };

    // Botón restar
    document.getElementById("btn-restar").onclick = () => {
        if (cantidad > 1) {
            cantidad--;
            document.getElementById("cantidad").textContent = cantidad;
        }
    };

    // Agregar al carrito
    document.getElementById("btn-agregar").onclick = () => {

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        // Ver si ya existe ese producto
        let existente = carrito.find(item => item.id === producto.id);

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                img: producto.img,
                cantidad: cantidad
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));

        alert("Producto agregado al carrito");
        window.location.href = "menu.html";
    };
}


// -----------------------------
// CARRITO
// -----------------------------
if (document.body.classList.contains("pantalla-carrito")) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const lista = document.getElementById("lista-carrito");
    const totalPrecio = document.getElementById("total-precio");

    function actualizarCarrito() {
        lista.innerHTML = "";
        let total = 0;

        carrito.forEach(item => {
            total += item.precio * item.cantidad;

            const div = document.createElement("div");
            div.className = "carrito-item";

            div.innerHTML = `
                <img src="${item.img}" alt="${item.nombre}">
                <div class="carrito-info">
                    <h3>${item.nombre}</h3>
                    <p>$${item.precio}</p>
                    <p>Cant: ${item.cantidad}</p>
                </div>

                <div class="carrito-controles">
                    <button class="btn-cantidad" onclick="sumarItem(${item.id})">+</button>
                    <button class="btn-cantidad" onclick="restarItem(${item.id})">–</button>
                    <button class="btn-eliminar" onclick="eliminarItem(${item.id})">X</button>
                </div>
            `;

            lista.appendChild(div);
        });

        totalPrecio.textContent = total;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // FUNCIONES
    window.sumarItem = function (id) {
        let item = carrito.find(p => p.id === id);
        item.cantidad++;
        actualizarCarrito();
    };

    window.restarItem = function (id) {
        let item = carrito.find(p => p.id === id);
        if (item.cantidad > 1) item.cantidad--;
        actualizarCarrito();
    };

    window.eliminarItem = function (id) {
        carrito = carrito.filter(p => p.id !== id);
        actualizarCarrito();
    };

    actualizarCarrito();

    // Confirmar pedido
    document.getElementById("btn-confirmar").onclick = () => {

        if (carrito.length === 0) {
            alert("No podés confirmar un pedido vacío.");
            return;
        }

        // Sin mensajes, pasa directo a la pantalla de pago
        window.location.href = "pago.html";
    };

}



// -----------------------------
// ABRIR CARRITO DESDE EL MENU
// -----------------------------
function abrirCarrito() {
    window.location.href = "carrito.html";
}


/// ===============================
//   PANTALLA DE PAGO (MEJORADA)
// ===============================
if (document.body.classList.contains("pantalla-pago")) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let total = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);

    // Mostrar total en pantalla si existe el elemento
    const monto = document.getElementById("monto-total");
    if (monto) monto.textContent = "$" + total;

    let metodoSeleccionado = null;

    const opciones = document.querySelectorAll(".opcion-pago");
    const btnConfirmar = document.getElementById("btn-confirmar-pago");

    // Selección visual
    opciones.forEach(op => {
        op.addEventListener("click", () => {
            opciones.forEach(o => o.classList.remove("pago-activo"));
            op.classList.add("pago-activo");

            metodoSeleccionado = op.dataset.metodo;
            btnConfirmar.disabled = false;
        });
    });

    // -----------------------------
    // BOTÓN CONFIRMAR
    // -----------------------------
    btnConfirmar.addEventListener("click", () => {

        if (!metodoSeleccionado) {
            alert("Seleccioná un método de pago.");
            return;
        }

        localStorage.setItem("metodoPago", metodoSeleccionado);

        // ------------------------------------
        // EFECTIVO
        // ------------------------------------
        if (metodoSeleccionado === "efectivo") {
            alert("Por favor acercate a caja para realizar el pago.");
            window.location.href = "confirmacion.html";
            return;
        }

        // ------------------------------------
        // TARJETA (DÉBITO)
        // ------------------------------------
        if (metodoSeleccionado === "tarjeta") {

            // llenar modal
            document.getElementById("total-tarjeta").textContent = "$" + total;

            const listaT = document.getElementById("lista-tarjeta");
            listaT.innerHTML = "";
            carrito.forEach(p => {
                const li = document.createElement("li");
                li.textContent = `${p.nombre} x${p.cantidad}`;
                listaT.appendChild(li);
            });

            // abrir modal
            document.getElementById("modal-tarjeta").classList.remove("oculto");

            // botón volver
            document.getElementById("btn-tarjeta-volver").onclick = () => {
                document.getElementById("modal-tarjeta").classList.add("oculto");
            };

            // botón "ya pasé mi tarjeta"
            document.getElementById("btn-tarjeta-confirmar").onclick = () => {
                window.location.href = "confirmacion.html";
            };

            return;
        }

        // ------------------------------------
        // PAGO CON QR
        // ------------------------------------
        if (metodoSeleccionado === "qr") {

            document.getElementById("total-qr").textContent = "$" + total;

            const listaQ = document.getElementById("lista-qr");
            listaQ.innerHTML = "";
            carrito.forEach(p => {
                const li = document.createElement("li");
                li.textContent = `${p.nombre} x${p.cantidad}`;
                listaQ.appendChild(li);
            });

            document.getElementById("modal-qr").classList.remove("oculto");

            // volver
            document.getElementById("btn-qr-volver").onclick = () => {
                document.getElementById("modal-qr").classList.add("oculto");
            };

            // ya pagué
            document.getElementById("btn-qr-confirmar").onclick = () => {
                window.location.href = "confirmacion.html";
            };

            return;
        }
    });
}



// ==============================
//   PANTALLA DE CONFIRMACION
// ==============================
if (document.body.classList.contains("pantalla-confirmacion")) {

    const metodo = localStorage.getItem("metodoPago") || "No especificado";
    document.getElementById("pago-metodo").textContent = metodo;

    // Código automático del pedido
    const codigo = "A" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById("codigo-pedido").textContent = codigo;

    // Limpiar carrito
    localStorage.removeItem("carrito");
    localStorage.removeItem("metodoPago");
    function volverInicio() {
        window.location.href = "index.html";
    }

}




// ===========================================
// FUNCIÓN CERRAR SESIÓN (ADMIN)
// ===========================================
function cerrarSesion() {
    document.getElementById("modalLogout").classList.remove("oculto");

    document.getElementById("logout-confirm").onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("usuario");
        window.location.href = "admin-login.html";
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


// ==========================================
//   ADMIN → PEDIDOS (VERSIÓN LIMPIA)
// ==========================================
if (window.location.pathname.includes("admin-pedidos.html")) {
    const contenedor = document.getElementById("lista-pedidos");

    // -----------------------------
    // DATOS SIMULADOS
    // -----------------------------
    let pedidos = [
        {
            id: 1,
            mesa: "Mesa 5",
            total: 8200,
            estado: "Pendiente",
            items: [
                { nombre: "Hamburguesa Clásica", cantidad: 1 },
                { nombre: "Coca-Cola", cantidad: 1 }
            ]
        },
        {
            id: 2,
            mesa: "Para llevar",
            total: 4600,
            estado: "En preparación",
            items: [
                { nombre: "Papas Grandes", cantidad: 1 },
                { nombre: "Doble Cuarto", cantidad: 1 }
            ]
        }
    ];

    // -----------------------------
    // RENDERIZAR PEDIDOS
    // -----------------------------
    function cargarPedidos() {
        contenedor.innerHTML = "";

        pedidos.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("pedido-card");

            card.innerHTML = `
                <div class="pedido-header">
                    <h3>Pedido #${p.id}</h3>
                    <span class="estado estado-${p.estado.toLowerCase().replace(" ", "-")}">
                        ${p.estado}
                    </span>
                </div>

                <p><strong>Origen:</strong> ${p.mesa}</p>
                <p><strong>Total:</strong> $${p.total}</p>

                <p><strong>Items:</strong></p>
                <ul class="pedido-items">
                    ${p.items.map(i => `<li>${i.cantidad} x ${i.nombre}</li>`).join("")}
                </ul>

                <div class="pedido-footer">
                    <button class="btn-estado" onclick="cambiarEstado(${p.id})">
                        Cambiar estado
                    </button>
                </div>
            `;

            contenedor.appendChild(card);
        });
    }

    // -----------------------------
    // CAMBIAR ESTADO (cíclico)
    // -----------------------------
    window.cambiarEstado = function (id) {
        let pedido = pedidos.find(x => x.id === id);

        const flujoEstados = ["Pendiente", "En preparación", "Listo", "Entregado"];
        let pos = flujoEstados.indexOf(pedido.estado);

        pedido.estado = flujoEstados[(pos + 1) % flujoEstados.length];

        cargarPedidos();
    };

    // -----------------------------
    // INICIALIZAR
    // -----------------------------
    cargarPedidos();
}




// ==========================================
//   PANTALLA: ADMIN → CATEGORÍAS
// ==========================================
if (document.body.classList.contains("admin-categorias-body") ||
    window.location.pathname.includes("admin-categorias.html")) {

    let categorias = [
        { id: 1, nombre: "Hamburguesas" },
        { id: 2, nombre: "Papas" },
        { id: 3, nombre: "Bebidas" },
        { id: 4, nombre: "Postres" }
    ];

    let editandoId = null;

    const tabla = document.getElementById("tabla-categorias");
    const nombreInput = document.getElementById("nombre-categoria");
    const tituloForm = document.getElementById("titulo-form");
    const btnCancelar = document.getElementById("btn-cancelar");

    function renderizarCategorias() {
        tabla.innerHTML = "";

        categorias.forEach(cat => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${cat.id}</td>
                <td>${cat.nombre}</td>
                <td>
                    <button class="btn-tabla btn-editar" onclick="editarCategoria(${cat.id})">Editar</button>
                    <button class="btn-tabla btn-eliminar" onclick="eliminarCategoria(${cat.id})">Eliminar</button>
                </td>
            `;

            tabla.appendChild(fila);
        });
    }

    window.guardarCategoria = function () {
        const nombre = nombreInput.value.trim();
        if (nombre === "") return alert("El nombre no puede estar vacío.");

        if (editandoId === null) {
            // CREAR
            const nuevo = {
                id: categorias.length + 1,
                nombre
            };
            categorias.push(nuevo);

        } else {
            // EDITAR
            let cat = categorias.find(c => c.id === editandoId);
            cat.nombre = nombre;

            editandoId = null;
            tituloForm.textContent = "Crear Categoría";
            btnCancelar.classList.add("oculto");
        }

        nombreInput.value = "";
        renderizarCategorias();
    };

    window.editarCategoria = function (id) {
        const cat = categorias.find(c => c.id === id);
        editandoId = id;

        nombreInput.value = cat.nombre;
        tituloForm.textContent = "Editar Categoría";
        btnCancelar.classList.remove("oculto");
    };

    window.eliminarCategoria = function (id) {
        if (!confirm("¿Eliminar categoría?")) return;
        categorias = categorias.filter(c => c.id !== id);
        renderizarCategorias();
    };

    window.cancelarEdicion = function () {
        editandoId = null;
        nombreInput.value = "";
        tituloForm.textContent = "Crear Categoría";
        btnCancelar.classList.add("oculto");
    };

    // Inicializar
    renderizarCategorias();
}



// ==========================================
//   PANTALLA: ADMIN → PLATOS
// ==========================================
if (document.body.classList.contains("admin-platos-body") ||
    window.location.pathname.includes("admin-platos.html")) {

    // DATOS SIMULADOS TEMPORALES
    let categorias = [
        { id: 1, nombre: "Hamburguesas" },
        { id: 2, nombre: "Papas" },
        { id: 3, nombre: "Bebidas" },
        { id: 4, nombre: "Postres" }
    ];

    let platos = [
        { id: 1, nombre: "Doble Cuarto de Libra", precio: 4200, categoriaId: 1, img: "img/plato1.jpg", disponible: true },
        { id: 2, nombre: "Papas Grandes", precio: 1800, categoriaId: 2, img: "img/plato3.jpg", disponible: true },
        { id: 3, nombre: "Coca Cola", precio: 1200, categoriaId: 3, img: "img/plato4.jpg", disponible: true }
    ];

    let editandoPlatoId = null;

    // ELEMENTOS
    const selectCategoria = document.getElementById("plato-categoria");
    const tablaPlatos = document.getElementById("tabla-platos");
    const nombreInput = document.getElementById("plato-nombre");
    const precioInput = document.getElementById("plato-precio");
    const imgInput = document.getElementById("plato-img");
    const disponibleInput = document.getElementById("plato-disponible");
    const tituloFormPlato = document.getElementById("titulo-form-plato");
    const btnCancelarPlato = document.getElementById("btn-cancelar-plato");


    // ============ CARGAR CATEGORÍAS EN SELECT ============
    function cargarCategoriasSelect() {
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.nombre;
            selectCategoria.appendChild(option);
        });
    }


    // ============ LISTADO DE PLATOS ============
    function renderizarPlatos() {
        tablaPlatos.innerHTML = "";

        platos.forEach(p => {
            const categoria = categorias.find(c => c.id === p.categoriaId)?.nombre || "—";

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${p.id}</td>
                <td><img src="${p.img}"> ${p.nombre}</td>
                <td>$${p.precio}</td>
                <td>${categoria}</td>
                <td>${p.disponible ? "Sí" : "No"}</td>
                <td>
                    <button class="btn-tabla btn-editar" onclick="editarPlato(${p.id})">Editar</button>
                    <button class="btn-tabla btn-eliminar" onclick="eliminarPlato(${p.id})">Eliminar</button>
                </td>
            `;

            tablaPlatos.appendChild(fila);
        });
    }


    // ============ GUARDAR (CREAR / EDITAR) ============
    window.guardarPlato = function () {
        const nombre = nombreInput.value.trim();
        const precio = Number(precioInput.value);
        const categoriaId = Number(selectCategoria.value);
        const img = imgInput.value.trim();
        const disponible = disponibleInput.checked;

        if (!nombre || !precio || !categoriaId) {
            return alert("Completa todos los campos.");
        }

        if (editandoPlatoId === null) {
            // CREAR
            const nuevo = {
                id: platos.length + 1,
                nombre,
                precio,
                categoriaId,
                img,
                disponible
            };
            platos.push(nuevo);
        } else {
            // EDITAR
            let plato = platos.find(p => p.id === editandoPlatoId);
            plato.nombre = nombre;
            plato.precio = precio;
            plato.categoriaId = categoriaId;
            plato.img = img;
            plato.disponible = disponible;

            editandoPlatoId = null;
            tituloFormPlato.textContent = "Crear Plato";
            btnCancelarPlato.classList.add("oculto");
        }

        limpiarFormularioPlatos();
        renderizarPlatos();
    };


    // ============ EDITAR ============
    window.editarPlato = function (id) {
        const plato = platos.find(p => p.id === id);
        editandoPlatoId = id;

        nombreInput.value = plato.nombre;
        precioInput.value = plato.precio;
        imgInput.value = plato.img;
        selectCategoria.value = plato.categoriaId;
        disponibleInput.checked = plato.disponible;

        tituloFormPlato.textContent = "Editar Plato";
        btnCancelarPlato.classList.remove("oculto");
    };


    // ============ ELIMINAR ============
    window.eliminarPlato = function (id) {
        if (!confirm("¿Eliminar plato?")) return;

        platos = platos.filter(p => p.id !== id);
        renderizarPlatos();
    };


    // ============ CANCELAR EDICIÓN ============
    window.cancelarEdicionPlato = function () {
        editandoPlatoId = null;
        limpiarFormularioPlatos();
        tituloFormPlato.textContent = "Crear Plato";
        btnCancelarPlato.classList.add("oculto");
    };


    function limpiarFormularioPlatos() {
        nombreInput.value = "";
        precioInput.value = "";
        imgInput.value = "";
        disponibleInput.checked = false;
        selectCategoria.value = categorias[0].id;
    }


    // ============ INICIALIZAR ============
    cargarCategoriasSelect();
    renderizarPlatos();
}




// ==========================================
//   PANTALLA: ADMIN → REPORTES
// ==========================================


// =============================================
// DATOS SIMULADOS PARA REPORTES
// =============================================
const ventasSimuladas = [
    { fecha: "2025-11-10", total: 8200 },
    { fecha: "2025-11-10", total: 5600 },
    { fecha: "2025-11-10", total: 3100 },
    { fecha: "2025-11-09", total: 7300 },
];

const platosVendidosSimulados = [
    { nombre: "Doble Cuarto de Libra", cantidad: 42 },
    { nombre: "Papas Grandes", cantidad: 35 },
    { nombre: "Coca-Cola", cantidad: 28 },
    { nombre: "Sundae", cantidad: 22 }
];

const pedidosEstadoSimulados = {
    pendiente: 5,
    preparacion: 3,
    listo: 2,
    entregado: 10
};


// =============================================
// ADMIN — REPORTES
// =============================================
if (document.body.classList.contains("admin-reportes-body")) {

    // ------ TOTAL HOY ------
    const hoy = "2025-11-10";

    const totalHoy = ventasSimuladas
        .filter(v => v.fecha === hoy)
        .reduce((acc, v) => acc + v.total, 0);

    document.getElementById("total-hoy").textContent = `$${totalHoy}`;

    // ------ TOP PLATOS ------
    const top = document.getElementById("top-platos");

    platosVendidosSimulados.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.nombre} — ${p.cantidad} ventas`;
        top.appendChild(li);
    });

    // ------ PEDIDOS POR ESTADO ------
    const listaEstados = document.getElementById("pedidos-estado");

    Object.entries(pedidosEstadoSimulados).forEach(([estado, cantidad]) => {
        const li = document.createElement("li");
        li.textContent = `${estado.toUpperCase()}: ${cantidad}`;
        listaEstados.appendChild(li);
    });
}






// ============================
// USUARIOS SIMULADOS
// ============================
let usuariosSimulados = [
    { id: 1, nombre: "admin", email: "admin@test.com", rol: "Administrador" },
    { id: 2, nombre: "juan", email: "juan@test.com", rol: "Cajero" },
    { id: 3, nombre: "maria", email: "maria@test.com", rol: "Mozo" }
];

// ============================
// ADMIN — USUARIOS
// ============================
if (document.body.classList.contains("admin-usuarios-body") ||
    window.location.pathname.includes("admin-usuarios.html")) {

    const tabla = document.getElementById("tabla-usuarios-body");
    const modal = document.getElementById("modal-usuario");

    let usuarioEditando = null;

    function cargarTablaUsuarios() {
        tabla.innerHTML = "";

        usuariosSimulados.forEach(u => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${u.id}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.rol}</td>
                <td>
                    <button class="btn-editar" onclick="editarUsuario(${u.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarUsuario(${u.id})">Eliminar</button>
                </td>
            `;

            tabla.appendChild(fila);
        });
    }

    window.abrirModalUsuario = function () {
        usuarioEditando = null;
        document.getElementById("modal-titulo").textContent = "Nuevo Usuario";
        modal.style.display = "flex";

        document.getElementById("usuario-nombre").value = "";
        document.getElementById("usuario-email").value = "";
        document.getElementById("usuario-pass").value = "";
        document.getElementById("usuario-rol").value = "Cajero";
    };

    window.cerrarModal = function () {
        modal.style.display = "none";
    };

    window.editarUsuario = function (id) {
        usuarioEditando = usuariosSimulados.find(u => u.id === id);

        document.getElementById("modal-titulo").textContent = "Editar Usuario";
        modal.style.display = "flex";

        document.getElementById("usuario-nombre").value = usuarioEditando.nombre;
        document.getElementById("usuario-email").value = usuarioEditando.email;
        document.getElementById("usuario-pass").value = "";
        document.getElementById("usuario-rol").value = usuarioEditando.rol;
    };

    window.guardarUsuario = function () {
        const nombre = document.getElementById("usuario-nombre").value;
        const email = document.getElementById("usuario-email").value;
        const pass = document.getElementById("usuario-pass").value;
        const rol = document.getElementById("usuario-rol").value;

        if (!nombre || !email) {
            alert("Completa todos los campos.");
            return;
        }

        if (usuarioEditando) {
            usuarioEditando.nombre = nombre;
            usuarioEditando.email = email;
            usuarioEditando.rol = rol;
        } else {
            usuariosSimulados.push({
                id: usuariosSimulados.length + 1,
                nombre,
                email,
                rol
            });
        }

        cerrarModal();
        cargarTablaUsuarios();
    };

    window.eliminarUsuario = function (id) {
        if (!confirm("¿Eliminar usuario?")) return;

        usuariosSimulados = usuariosSimulados.filter(u => u.id !== id);
        cargarTablaUsuarios();
    };

    cargarTablaUsuarios();
}
