const API_URL = "http://localhost:5151/api/Usuarios";
let editandoId = null;


async function cargarUsuarios() {
    try {
        const token = localStorage.getItem("token");
        
        if (!token) {
            alert("No hay token de autenticación");
            window.location.href = "../../admin-login.html";
            return;
        }

        const res = await fetch(API_URL, {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            console.error("Error al cargar usuarios:", res.status);
            if (res.status === 401) {
                alert("Sesión expirada. Por favor inicia sesión nuevamente.");
                window.location.href = "../../admin-login.html";
                return;
            }
            throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Usuarios cargados:", data);

        const tbody = document.getElementById("tabla-usuarios-body");
        tbody.innerHTML = "";

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay usuarios registrados</td></tr>';
            return;
        }

        data.forEach(u => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${u.idUsuario}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.rol}</td>
                <td>
                    <button onclick="editarUsuario(${u.idUsuario}, '${u.nombre.replace(/'/g, "\\'")}', '${u.email}', '${u.rol}')">✏ Editar</button>
                    <button onclick="eliminarUsuario(${u.idUsuario})">❌ Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error cargando usuarios:", error);
        alert("Error al cargar la lista de usuarios: " + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada, cargando usuarios...");
    cargarUsuarios();
});


function abrirModalUsuario() {
    editandoId = null;
    document.getElementById("modal-titulo").innerText = "Nuevo Usuario";
    document.getElementById("usuario-nombre").value = "";
    document.getElementById("usuario-email").value = "";
    document.getElementById("usuario-pass").value = "";
    document.getElementById("usuario-rol").value = "Mozo";

    document.getElementById("modal-usuario").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modal-usuario").style.display = "none";
}


function editarUsuario(id, nombre, email, rol) {
    editandoId = id;

    document.getElementById("modal-titulo").innerText = "Editar Usuario";
    document.getElementById("usuario-nombre").value = nombre;
    document.getElementById("usuario-email").value = email;
    document.getElementById("usuario-pass").value = ""; 
    document.getElementById("usuario-rol").value = rol;

    document.getElementById("modal-usuario").style.display = "block";
}


async function guardarUsuario() {
    try {
        const nombre = document.getElementById("usuario-nombre").value.trim();
        const email = document.getElementById("usuario-email").value.trim();
        const password = document.getElementById("usuario-pass").value;
        const rol = document.getElementById("usuario-rol").value;

       
        if (!nombre) {
            alert("El nombre es obligatorio");
            return;
        }

        if (!email) {
            alert("El email es obligatorio");
            return;
        }

        if (!editandoId && !password) {
            alert("La contraseña es obligatoria para crear un nuevo usuario");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("No hay token de autenticación");
            window.location.href = "../../admin-login.html";
            return;
        }

        const usuario = {
            nombre,
            email,
            password,
            rol,
            activo: true,
            fechaCreacion: new Date().toISOString()
        };

       
        if (password) {
            usuario.password = password;
        }

        
        if (editandoId) {
            usuario.idUsuario = editandoId;
        }

        let metodo = editandoId ? "PUT" : "POST";
        let url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

        console.log("Enviando:", metodo, url, usuario);

        const res = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        });

        const responseData = await res.json();
        console.log("Respuesta del servidor:", responseData);

        if (!res.ok) {
            alert("Error al guardar usuario: " + (responseData.message || res.statusText));
            return;
        }

        alert(editandoId ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
        cerrarModal();
        await cargarUsuarios();
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        alert("Error al guardar usuario: " + error.message);
    }
}


async function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert("Error eliminando usuario: " + (errorData.message || res.statusText));
            return;
        }

        alert("Usuario eliminado correctamente");
        await cargarUsuarios();
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Error al eliminar usuario: " + error.message);
    }
}