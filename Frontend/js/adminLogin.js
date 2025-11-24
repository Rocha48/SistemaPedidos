// =========================================
//   LOGIN DE USUARIOS DEL RESTAURANTE
// =========================================

async function loginAdmin() {

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value;
    const error = document.getElementById("login-error");

    error.innerText = "";

    // Validar campos vacíos
    if (!usuario || !password) {
        error.innerText = "Completá ambos campos.";
        return;
    }

    /* ---------------------------
       DATOS SIMULADOS POR AHORA
       Cambiar cuando exista API
    ---------------------------- */
    
    // Base de datos simulada de usuarios
    const usuariosSimulados = {
        admin: {
            password: "1234",
            rol: "Administrador",
            nombre: "Administrador del Sistema",
            redireccion: "users/admin/admin-panel.html"
        },
        cocinero: {
            password: "0123",
            rol: "Cocina",
            nombre: "Personal de Cocina",
            redireccion: "users/cocinero/cocinero-panel.html"
        },
        mozo: {
            password: "mozo123",
            rol: "Mozo",
            nombre: "Mozo del Restaurante",
            redireccion: "users/mozo/mozo-panel.html"
        },
        cajero: {
            password: "cajero123",
            rol: "Cajero",
            nombre: "Cajero del Restaurante",
            redireccion: "users/cajero/cajero-panel.html"
        }
    };

    // Buscar usuario en la base simulada
    const usuarioEncontrado = usuariosSimulados[usuario.toLowerCase()];

    if (!usuarioEncontrado) {
        error.innerText = "❌ Usuario no encontrado.";
        return;
    }

    // Validar contraseña
    if (usuarioEncontrado.password !== password) {
        error.innerText = "❌ Contraseña incorrecta.";
        return;
    }

    // Login exitoso - Guardar datos en localStorage
    localStorage.setItem("token", "token-simulacion-" + Date.now());
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("rol", usuarioEncontrado.rol);
    localStorage.setItem("nombreCompleto", usuarioEncontrado.nombre);

    console.log("✅ Login exitoso:", {
        usuario: usuario,
        rol: usuarioEncontrado.rol,
        redireccion: usuarioEncontrado.redireccion
    });

    // Redireccionar según el rol
    window.location.href = usuarioEncontrado.redireccion;

    /* ================================================
       CÓDIGO PARA CUANDO ESTÉ EL BACKEND CONECTADO
    ================================================ */
    /*
    try {
        const respuesta = await fetch("http://localhost:5164/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                usuario: usuario, 
                password: password 
            })
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            error.innerText = errorData.message || "Usuario o contraseña incorrectos.";
            return;
        }

        const data = await respuesta.json();

        // Guardar token JWT real y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", data.usuario);
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("nombreCompleto", data.nombreCompleto);

        // Redireccionar según el rol del backend
        switch(data.rol) {
            case "Administrador":
                window.location.href = "users/admin/admin-panel.html";
                break;
            case "Cocina":
                window.location.href = "users/cocinero/cocinero-panel.html";
                break;
            case "Mozo":
                window.location.href = "users/mozo/mozo-panel.html";
                break;
            case "Cajero":
                window.location.href = "users/cajero/cajero-panel.html";
                break;
            default:
                error.innerText = "Rol de usuario no válido.";
        }

    } catch (e) {
        console.error("Error en login:", e);
        error.innerText = "Error al conectar con el servidor.";
    }
    */
}

// Permitir login con Enter
document.addEventListener("DOMContentLoaded", () => {
    const inputPassword = document.getElementById("password");
    
    if (inputPassword) {
        inputPassword.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                loginAdmin();
            }
        });
    }
});