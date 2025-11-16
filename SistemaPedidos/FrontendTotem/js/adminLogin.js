async function loginAdmin() {

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("login-error");

    error.innerText = "";

    if (!usuario || !password) {
        error.innerText = "Completá ambos campos.";
        return;
    }

    /* ---------------------------
       DATOS SIMULADOS POR AHORA
       Cambiar cuando exista API
    ---------------------------- */
    if (usuario === "admin" && password === "1234") {

        // Guardamos un token simulado
        localStorage.setItem("token", "token-simulacion-123");

        window.location.href = "admin-panel.html";
        return;
    }

    // Cuando esté el backend, usamos este bloque:
    /*
    try {
        const respuesta = await fetch("http://localhost:5164/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario, password })
        });

        if (!respuesta.ok) {
            error.innerText = "Usuario o contraseña incorrectos.";
            return;
        }

        const data = await respuesta.json();

        // Guardar token JWT real
        localStorage.setItem("token", data.token);

        window.location.href = "admin-panel.html";

    } catch (e) {
        error.innerText = "Error al conectar con el servidor.";
    }
    */
}
