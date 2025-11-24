const API_URL = "http://localhost:5151/api/Categorias";  // ✅ HTTP
let categoriaEditando = null;

// ===============================
//  CARGAR CATEGORÍAS EN TABLA
// ===============================
async function cargarCategorias() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No hay token de autenticación");
            window.location.href = "../../admin-login.html";
            return;
        }

        console.log("Cargando categorías...");

        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Error en la respuesta:", response.status);
            if (response.status === 401) {
                alert("Sesión expirada. Por favor inicia sesión nuevamente.");
                window.location.href = "../../admin-login.html";
                return;
            }
            throw new Error(`Error: ${response.status}`);
        }

        const categorias = await response.json();
        console.log("Categorías cargadas:", categorias);

        const tabla = document.getElementById("tabla-categorias");
        tabla.innerHTML = "";

        if (categorias.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3" style="text-align:center;">No hay categorías registradas</td></tr>';
            return;
        }

        categorias.forEach(cat => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cat.idCategoria}</td>
                <td>${cat.nombre}</td>
                <td>
                    <button class="btn-editar" onclick="editarCategoria(${cat.idCategoria}, '${cat.nombre.replace(/'/g, "\\'")}')">✏ Editar</button>
                    <button class="btn-eliminar" onclick="eliminarCategoria(${cat.idCategoria})">🗑 Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error("Error cargando categorías:", error);
        alert("Error al cargar categorías: " + error.message);
    }
}

// ===============================
//  GUARDAR / EDITAR CATEGORÍA
// ===============================
async function guardarCategoria() {
    try {
        const nombre = document.getElementById("nombre-categoria").value.trim();
        const token = localStorage.getItem("token");

        if (!nombre) {
            alert("El nombre es obligatorio.");
            return;
        }

        if (!token) {
            alert("No hay token de autenticación");
            window.location.href = "../../admin-login.html";
            return;
        }

        let response;

        // Si está editando
        if (categoriaEditando !== null) {
            console.log("Actualizando categoría:", categoriaEditando, nombre);

            response = await fetch(`${API_URL}/${categoriaEditando}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idCategoria: categoriaEditando,
                    nombre: nombre
                })
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (!response.ok) {
                alert("Error al actualizar: " + (data.message || response.statusText));
                return;
            }

            alert("Categoría actualizada correctamente.");
        } else {
            // Crear nueva categoría
            console.log("Creando nueva categoría:", nombre);

            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ nombre: nombre })
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (!response.ok) {
                alert("Error al crear: " + (data.message || response.statusText));
                return;
            }

            alert("Categoría creada correctamente.");
        }

        cancelarEdicion();
        await cargarCategorias();

    } catch (error) {
        console.error("Error al guardar categoría:", error);
        alert("Error al guardar: " + error.message);
    }
}

// ===============================
//  EDITAR CATEGORÍA - completa el formulario
// ===============================
function editarCategoria(id, nombre) {
    categoriaEditando = id;

    document.getElementById("titulo-form").textContent = "Editar Categoría";
    document.getElementById("nombre-categoria").value = nombre;

    document.getElementById("btn-guardar").textContent = "Actualizar";
    document.getElementById("btn-cancelar").classList.remove("oculto");
}

// ===============================
//  CANCELAR EDICIÓN
// ===============================
function cancelarEdicion() {
    categoriaEditando = null;

    document.getElementById("titulo-form").textContent = "Crear Categoría";
    document.getElementById("nombre-categoria").value = "";

    document.getElementById("btn-guardar").textContent = "Guardar";
    document.getElementById("btn-cancelar").classList.add("oculto");
}

// ===============================
//  ELIMINAR CATEGORÍA
// ===============================
async function eliminarCategoria(id) {
    if (!confirm("¿Eliminar categoría?")) return;

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        if (!response.ok) {
            alert("Error al eliminar: " + (data.message || response.statusText));
            return;
        }

        alert("Categoría eliminada correctamente");
        await cargarCategorias();

    } catch (error) {
        console.error("Error al eliminar categoría:", error);
        alert("Error al eliminar: " + error.message);
    }
}

// ===============================
//  INICIAR AUTOMÁTICO AL ABRIR PANTALLA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada, cargando categorías...");
    cargarCategorias();
});