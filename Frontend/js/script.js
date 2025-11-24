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

    // Agregar botón "TODOS" primero
    const btnTodos = document.createElement("div");
    btnTodos.className = "categoria-btn";
    btnTodos.textContent = "Todos";
    
    btnTodos.onclick = () => {
        mostrarTodosLosProductos();
        cerrarSidebar();
    };
    
    contenedor.appendChild(btnTodos);

    // Agregar categorías
    categorias.forEach(cat => {
        const btn = document.createElement("div");
        btn.className = "categoria-btn";
        btn.textContent = cat.nombre;

        btn.onclick = () => {
            filtrarPorCategoria(cat.id);
            cerrarSidebar();
        };

        contenedor.appendChild(btn);
    });
}


// -----------------------------
// CERRAR SIDEBAR
// -----------------------------
function cerrarSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    
    if (sidebar) sidebar.classList.remove("sidebar-open");
    if (overlay) overlay.classList.remove("activo");
    document.body.classList.remove("menu-abierto");
}

// -----------------------------
// TOGGLE SIDEBAR
// -----------------------------
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    
    sidebar.classList.toggle("sidebar-open");
    overlay.classList.toggle("activo");
    document.body.classList.toggle("menu-abierto");
}

// -----------------------------
// MOSTRAR TODOS LOS PRODUCTOS
// -----------------------------
function mostrarTodosLosProductos() {
    const contenedor = document.getElementById("lista-productos");
    contenedor.innerHTML = "";

    productos.forEach(prod => {
        contenedor.appendChild(crearCardProducto(prod));
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
                cantidad: cantidad,
               
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

    // SUMAR / RESTAR / ELIMINAR
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

    // -----------------------------
    // CONFIRMAR PEDIDO
    // -----------------------------
    document.getElementById("btn-confirmar").onclick = () => {
    
        if (carrito.length === 0) {
            alert("No podés confirmar un pedido vacío.");
            return;
        }

        // Nombre del cliente
        const nombreCliente = document.getElementById("nombre-cliente").value.trim();
        
        if (!nombreCliente) {
            alert("Por favor, ingresá tu nombre para continuar.");
            document.getElementById("nombre-cliente").focus();
            return;
        }

        //  OBTENER OBSERVACIONES EN EL MOMENTO CORRECTO
        const observacionesGenerales = document
            .getElementById("observaciones-generales")
            .value
            .trim();

        // Guardar datos correctamente
        localStorage.setItem("nombreCliente", nombreCliente);
        localStorage.setItem("observacionesGenerales", observacionesGenerales);

        // Ir a pago
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
//   PANTALLA DE CONFIRMACIÓN
// ==============================
if (document.body.classList.contains("pantalla-confirmacion")) {

    console.log("Pantalla de confirmación cargada");

    // Obtener datos desde localStorage
    const nombreCliente = localStorage.getItem("nombreCliente") || "Cliente";
    const metodoPago = localStorage.getItem("metodoPago") || "No especificado";
    const observaciones = localStorage.getItem("observacionesGenerales") || "";
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // DATOS NUEVOS
    const tipoPedido = localStorage.getItem("tipoPedido") || "No especificado";
    const mesa = localStorage.getItem("mesa") || localStorage.getItem("mesaSeleccionada") || "N/A";


    // Mostrar datos
    document.getElementById("nombre-cliente-confirmacion").textContent = nombreCliente;
    document.getElementById("pago-metodo").textContent = metodoPago;

    document.getElementById("tipo-pedido-confirmacion").textContent =
        tipoPedido === "local" ? "Consumir en el local" : "Para llevar";

    document.getElementById("mesa-confirmacion").textContent =
        tipoPedido === "local" ? mesa : "No corresponde";

    // Código del pedido
    const codigoGenerado = "A" + Math.floor(1000 + Math.random() * 9000);
    document.getElementById("codigo-pedido").textContent = codigoGenerado;

    // Mostrar observaciones
    if (observaciones.trim() !== "") {
        document.getElementById("observaciones-confirmacion").textContent = observaciones;
        document.getElementById("observaciones-box").style.display = "block";
    }

    // Total del carrito
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Crear objeto del pedido
    const pedido = {
        id: codigoGenerado,
        cliente: nombreCliente,
        metodoPago: metodoPago,
        tipoPedido: tipoPedido,
        mesa: mesa,
        observaciones: observaciones,
        items: carrito,
        total: total,
        fecha: new Date().toISOString()
    };

    // Guardar en historial
    let historial = JSON.parse(localStorage.getItem("pedidosHistorial")) || [];
    historial.push(pedido);
    localStorage.setItem("pedidosHistorial", JSON.stringify(historial));

    console.log("Pedido guardado:", pedido);

    // AHORA sí: limpiar datos
    setTimeout(() => {
        localStorage.removeItem("carrito");
        localStorage.removeItem("nombreCliente");
        localStorage.removeItem("metodoPago");
        localStorage.removeItem("observacionesGenerales");
        localStorage.removeItem("mesa");
        console.log("Datos limpiados correctamente");
    }, 500); // Espera medio segundo para asegurar que se muestren los datos
}


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



// ==========================================
//   PANTALLA: ADMIN → CATEGORÍAS
// ==========================================
if (document.body.classList.contains("admin-categorias-body")) {

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
        if (!nombre) return alert("El nombre no puede estar vacío.");

        if (editandoId === null) {
            const nuevo = {
                id: categorias.length + 1,
                nombre
            };
            categorias.push(nuevo);

        } else {
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
if (
    document.body.classList.contains("admin-platos-body") ||
    window.location.pathname.includes("admin-platos.html")
) {

    // ==== DATOS SIMULADOS TEMPORALES ====
    let categorias = [
        { id: 1, nombre: "Hamburguesas" },
        { id: 2, nombre: "Papas" },
        { id: 3, nombre: "Bebidas" },
        { id: 4, nombre: "Postres" }
    ];

    let platos = [
        { id: 1, nombre: "Doble Cuarto de Libra", descripcion: "Carne doble", precio: 4200, categoriaId: 1, img: "img/plato1.jpg", disponible: true },
        { id: 2, nombre: "Papas Grandes", descripcion: "Papas fritas", precio: 1800, categoriaId: 2, img: "img/plato3.jpg", disponible: true },
        { id: 3, nombre: "Coca Cola", descripcion: "Bebida fría", precio: 1200, categoriaId: 3, img: "img/plato4.jpg", disponible: true }
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

    // ==== CARGAR CATEGORÍAS ====
    function cargarCategoriasSelect() {
        selectCategoria.innerHTML = "";
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.nombre;
            selectCategoria.appendChild(option);
        });
    }

    // ==== RENDERIZAR TABLA ====
    function renderizarPlatos() {
        tablaPlatos.innerHTML = "";

        platos.forEach(p => {
            const categoriaNombre = categorias.find(c => c.id === p.categoriaId)?.nombre || "—";

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.id}</td>
                <td><img src="${p.img}"> ${p.nombre}</td>
                <td>$${p.precio}</td>
                <td>${categoriaNombre}</td>
                <td>${p.disponible ? "Sí" : "No"}</td>
                <td>
                    <button class="btn-tabla btn-editar" onclick="editarPlato(${p.id})">Editar</button>
                    <button class="btn-tabla btn-eliminar" onclick="eliminarPlato(${p.id})">Eliminar</button>
                </td>
            `;
            tablaPlatos.appendChild(fila);
        });
    }

    // ==== GUARDAR PLATO ====
    window.guardarPlato = function () {
        const nombre = nombreInput.value.trim();
        const precio = Number(precioInput.value);
        const categoriaId = Number(selectCategoria.value);
        const img = imgInput.value.trim();
        const disponible = disponibleInput.checked;

        // VALIDACIONES
        if (!nombre) return alert("El nombre no puede estar vacío.");
        if (!precioInput.value) return alert("Debes ingresar un precio.");
        if (isNaN(precio)) return alert("El precio debe ser un número válido.");
        if (precio <= 0) return alert("El precio debe ser mayor a 0.");
        if (!categoriaId) return alert("Debes seleccionar una categoría.");
        if (!img) return alert("Debes ingresar una ruta de imagen.");

        if (editandoPlatoId === null) {

            const nuevo = {
                id: platos.length + 1,   // si querés puedo volver a poner Date.now()
                nombre,
                precio,
                categoriaId,
                img,
                disponible
            };

            platos.push(nuevo);

        } else {

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

    // ==== EDITAR ====
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

    // ==== ELIMINAR ====
    window.eliminarPlato = function (id) {
        if (!confirm("¿Eliminar plato?")) return;
        platos = platos.filter(p => p.id !== id);
        renderizarPlatos();
    };

    // ==== CANCELAR ====
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

    // ==== INICIO ====
    cargarCategoriasSelect();
    renderizarPlatos();
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
/* =============================
      ADMIN - GESTIÓN DE MESAS
============================= */

// Crear mesas por defecto si no existen
function inicializarMesas() {
    if (!localStorage.getItem("mesas")) {
        const mesasIniciales = [
            { id: 1, numero: "1", estado: "Libre" },
            { id: 2, numero: "2", estado: "Libre" },
            { id: 3, numero: "3", estado: "Ocupada" }
        ];
        localStorage.setItem("mesas", JSON.stringify(mesasIniciales));
    }
}

// Cargar mesas
function cargarMesas() {
    const contenedor = document.getElementById("mesas-lista");
    if (!contenedor) return;

    let mesas = JSON.parse(localStorage.getItem("mesas")) || [];

    contenedor.innerHTML = "";

    if (mesas.length === 0) {
        contenedor.innerHTML = `<p class="mensaje-vacio">No hay mesas registradas.</p>`;
        return;
    }

    mesas.forEach(mesa => {
        const div = document.createElement("div");
        div.classList.add("mesa-card");

        div.innerHTML = `
            <p class="mesa-numero">Mesa ${mesa.numero}</p>
            <p class="mesa-estado ${mesa.estado === "Libre" ? "libre" : "ocupada"}">
                ${mesa.estado}
            </p>
            <button class="btn-editar-mesa" onclick="cambiarEstadoMesa(${mesa.id})">Cambiar Estado</button>
            <button class="btn-eliminar-mesa" onclick="eliminarMesa(${mesa.id})">Eliminar</button>
        `;

        contenedor.appendChild(div);
    });
}

// Abrir modal (prompt) para agregar mesa
function abrirModalMesa() {
    const numero = prompt("Ingresá número de mesa:");

    if (!numero || numero.trim() === "") {
        alert("Debes ingresar un número válido");
        return;
    }

    if (isNaN(numero) || numero <= 0) {
        alert("Número inválido");
        return;
    }

    let mesas = JSON.parse(localStorage.getItem("mesas")) || [];

    if (mesas.some(m => m.numero == numero)) {
        alert("Ya existe una mesa con ese número");
        return;
    }

    mesas.push({
        id: Date.now(),
        numero: numero,
        estado: "Libre"
    });

    localStorage.setItem("mesas", JSON.stringify(mesas));
    alert("Mesa agregada correctamente");
    cargarMesas();
}

// Cambiar estado
function cambiarEstadoMesa(id) {
    let mesas = JSON.parse(localStorage.getItem("mesas"));

    mesas = mesas.map(m => {
        if (m.id === id) {
            m.estado = m.estado === "Libre" ? "Ocupada" : "Libre";
        }
        return m;
    });

    localStorage.setItem("mesas", JSON.stringify(mesas));
    cargarMesas();
}

// Eliminar mesa
function eliminarMesa(id) {
    if (!confirm("¿Eliminar mesa?")) return;

    let mesas = JSON.parse(localStorage.getItem("mesas"));
    mesas = mesas.filter(m => m.id !== id);

    localStorage.setItem("mesas", JSON.stringify(mesas));
    cargarMesas();
}


// =============================
//  INICIALIZACIÓN - SOLO AQUÍ
// =============================
document.addEventListener("DOMContentLoaded", () => {

    // Verificar que estamos en la página correcta
    if (!document.body.classList.contains("admin-gestion-mesas")) return;

    console.log("📌 Página de Gestión de Mesas detectada");

    inicializarMesas();
    cargarMesas();

    const btnAgregar = document.getElementById("btnAgregarMesa");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", abrirModalMesa);
    } else {
        console.error("❌ No se encontró el botón btnAgregarMesa");
    }
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