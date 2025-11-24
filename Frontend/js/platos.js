// platos.js (CORREGIDO)
const API_URL = "http://localhost:5151/api/Platos";
const API_CATEGORIAS = "http://localhost:5151/api/Categorias";

let editando = false;
let idEditar = null;
let categorias = [];

// arranque
(async () => {
    await cargarCategorias();
    await cargarPlatos();
})();

// ------------------------------
// CARGAR CATEGORÍAS
// ------------------------------
async function cargarCategorias() {
    try {
        const response = await fetch(API_CATEGORIAS, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (!response.ok) throw new Error("Error al cargar categorías");

        categorias = await response.json();

        const select = document.getElementById("plato-categoria");
        if (!select) return;
        select.innerHTML = "";

        // OJO: backend actual espera el NOMBRE de la categoría en dto.Categoria.
        // Si en el futuro cambias el backend para recibir idCategoria, cambia option.value = c.idCategoria.
        categorias.forEach(c => {
            const option = document.createElement("option");
            option.value = c.nombre; // <- nombre porque tu DTO espera Categoria:string
            option.textContent = c.nombre;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar categorías:", error);
        alert("No se pudieron cargar las categorías. Revisa la consola.");
    }
}

// ------------------------------
// CARGAR PLATOS
// ------------------------------
async function cargarPlatos() {
    try {
        const response = await fetch(API_URL, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (!response.ok) {
            // si 401/403 dar aviso claro
            if (response.status === 401) {
                alert("No autorizado. Iniciá sesión de nuevo.");
                window.location.href = "../../admin-login.html";
                return;
            }
            throw new Error("Error cargando platos");
        }

        const platos = await response.json();
        const tbody = document.getElementById("tabla-platos");
        if (!tbody) return;
        tbody.innerHTML = "";

        platos.forEach(plato => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${plato.idPlato}</td>
                <td>${plato.nombre}</td>
                <td>${plato.precio}</td>
                <td>${plato.categoria ?? "Sin categoría"}</td>
                <td>${plato.disponible ? "Sí" : "No"}</td>
                <td>
                    <button onclick="editarPlato(${plato.idPlato})">✏ Editar</button>
                    <button onclick="eliminarPlato(${plato.idPlato})">🗑 Eliminar</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error al cargar platos:", error);
        alert("Error cargando platos. Revisa la consola.");
    }
}

// ------------------------------
// GUARDAR (CREAR / EDITAR)
// ------------------------------
async function guardarPlato() {
    // refresco categorías por las dudas (si alguien agregó una categoría en otra pestaña)
    await cargarCategorias();

    const nombre = document.getElementById("plato-nombre")?.value ?? "";
    const descripcion = document.getElementById("plato-descripcion")?.value ?? "";
    const precioVal = document.getElementById("plato-precio")?.value ?? "";
    const precio = parseFloat(precioVal) || 0;
    const categoria = document.getElementById("plato-categoria")?.value ?? "";
    const imagenURL = document.getElementById("plato-img")?.value ?? "";
    const disponible = document.getElementById("plato-disponible")?.checked ?? false;

    if (!nombre) { alert("El nombre es obligatorio."); return; }
    if (precio <= 0) { alert("El precio debe ser mayor a 0."); return; }
    if (!categoria) { alert("Seleccioná una categoría."); return; }

    const plato = {
        idPlato: idEditar ?? 0,
        nombre,
        descripcion,
        precio,
        categoria,    // backend espera nombre (dto.Categoria)
        imagenURL,
        disponible
    };

    const url = editando ? `${API_URL}/${idEditar}` : API_URL;
    const method = editando ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(plato)
        });

        if (!response.ok) {
            // Intento leer JSON con message o texto plano
            let msg = "";
            try {
                const j = await response.json();
                msg = j.message ?? JSON.stringify(j);
            } catch {
                msg = await response.text();
            }
            alert("❌ Error del servidor: " + (msg || response.statusText));
            return;
        }

        // OK
        // si el endpoint devuelve JSON (ej {message, id}) lo podemos leer, si no no pasa nada
        try { await response.json(); } catch (e) { /* no JSON devuelto */ }

        alert("✔ Plato guardado correctamente");
        await cargarPlatos();
        limpiarFormulario();

    } catch (error) {
        console.error("Error guardarPlato:", error);
        alert("No se pudo guardar (error de conexión). Revisa la consola.");
    }
}

// ------------------------------
// EDITAR
// ------------------------------
async function editarPlato(id) {
    try {
        // recargo categorias antes por si cambió
        await cargarCategorias();

        const response = await fetch(`${API_URL}/${id}`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (!response.ok) {
            alert("Error al obtener plato para editar");
            return;
        }

        const plato = await response.json();

        idEditar = id;
        editando = true;

        document.getElementById("plato-nombre").value = plato.nombre ?? "";
        document.getElementById("plato-descripcion").value = plato.descripcion ?? "";
        document.getElementById("plato-precio").value = plato.precio ?? "";
        document.getElementById("plato-img").value = plato.imagenURL ?? "";
        document.getElementById("plato-disponible").checked = !!plato.disponible;

        // selecciono la categoría por texto (porque option.value = nombre)
        const select = document.getElementById("plato-categoria");
        if (select) {
            for (let opt of select.options) {
                if (opt.value === plato.categoria) {
                    select.value = opt.value;
                    break;
                }
            }
        }
        // cambiar título del formulario si lo tenés visible
        const titulo = document.getElementById("titulo-form-plato");
        if (titulo) titulo.innerText = "Editar Plato";

    } catch (error) {
        console.error("Error editarPlato:", error);
        alert("No se pudo cargar el plato para editar. Revisa la consola.");
    }
}

// ------------------------------
// ELIMINAR
// ------------------------------
async function eliminarPlato(id) {
    if (!confirm("¿Seguro que querés eliminar este plato?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (!response.ok) {
            let txt = "";
            try { txt = await response.text(); } catch { txt = response.statusText; }
            alert("Error al eliminar: " + txt);
            return;
        }

        alert("Plato eliminado ✔");
        await cargarPlatos();

    } catch (error) {
        console.error("Error eliminando:", error);
        alert("No se pudo eliminar (error de conexión).");
    }
}

// ------------------------------
// LIMPIAR FORMULARIO
// ------------------------------
function limpiarFormulario() {
    const get = id => document.getElementById(id);
    if (get("plato-nombre")) get("plato-nombre").value = "";
    if (get("plato-descripcion")) get("plato-descripcion").value = "";
    if (get("plato-precio")) get("plato-precio").value = "";
    if (get("plato-categoria")) get("plato-categoria").value = (get("plato-categoria").options[0]?.value ?? "");
    if (get("plato-img")) get("plato-img").value = "";
    if (get("plato-disponible")) get("plato-disponible").checked = false;

    idEditar = null;
    editando = false;

    const titulo = document.getElementById("titulo-form-plato");
    if (titulo) titulo.innerText = "Crear Plato";
}
