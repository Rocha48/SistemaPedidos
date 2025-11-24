// =========================================
//   LOGIN CON REDIRECCIÓN POR ROL
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

    try {
        // Llamada al backend
        const respuesta = await fetch("http://localhost:5151/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                username: usuario,    
                password: password    
            })
        });

        // Si falla
        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            error.innerText = errorData.message || "Usuario o contraseña incorrectos.";
            return;
        }

        // Respuesta OK (200)
        const data = await respuesta.json();

        // Guardamos el token JWT
        localStorage.setItem("token", data.token);

        console.log("Login exitoso, token recibido:", data.token);

        // Decodificar el token para obtener el rol
        const rol = obtenerRolDelToken(data.token);
        console.log("Rol del usuario:", rol);

        // Guardar el rol también (opcional pero útil)
        localStorage.setItem("userRole", rol);

        // Redirigir según el rol
        redirigirSegunRol(rol);

    } catch (e) {
        console.error("Error en login:", e);
        error.innerText = "Error al conectar con el servidor.";
    }
}

// =========================================
//   DECODIFICAR TOKEN JWT
// =========================================
function obtenerRolDelToken(token) {
    try {
        // El token JWT tiene 3 partes separadas por punto: header.payload.signature
        const payload = token.split('.')[1];
        
        // Decodificar base64
        const decodificado = JSON.parse(atob(payload));
        
        // El rol está en la claim "role"
        return decodificado.role || decodificado["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Usuario";
    } catch (e) {
        console.error("Error al decodificar token:", e);
        return "Usuario";
    }
}

// =========================================
//   REDIRIGIR SEGÚN ROL
// =========================================
function redirigirSegunRol(rol) {
    console.log("Redirigiendo a:", rol); // Debug
    
    switch(rol.toLowerCase()) {
        case "admin":
        case "administrador":
            window.location.href = "users/admin/admin-panel.html";
            break;
        
        case "mozo":
        case "mesero":
            window.location.href = "users/mozo/mozo-panel.html";
            break;
        
        case "cocinero":
        case "cocina":
            window.location.href = "users/cocinero/cocinero-panel.html";
            break;
        
        case "caja":
        case "cajero":
            window.location.href = "users/caja/caja-panel.html";
            break;
        
        default:
            console.warn("Rol no reconocido:", rol);
            window.location.href = "users/admin/admin-panel.html"; // Fallback
            break;
    }
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