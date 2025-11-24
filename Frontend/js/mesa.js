/* mesa.js */
const API_URL = "http://localhost:5151/api/Mesas";

let editando = false;
let idEditar = null;

// Inicialización segura al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    initMesas();
});

async function initMesas() {
    // verifica token
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../../admin-login.html";
        return;
    }

    // cargar lista
    await cargarMesas();

    // botón agregar
    const btnAgregar = document.getElementById("btnAgregarMesa");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            editando = false;
            idEditar = null;
            abrirModal(); // abrir modal nuevo
        });
    }
}

/* ---------------------------
   CARGAR LISTA DE MESAS
   --------------------------- */
async function cargarMesas() {
    try {
        const response = await fetch(API_URL, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (!response.ok) {
            const txt = await response.text().catch(() => "");
            throw new Error("Error cargando mesas: " + (txt || response.status));
        }

        const mesas = await response.json();
        const contenedor = document.getElementById("mesas-lista");
        contenedor.innerHTML = "";

        mesas.forEach(mesa => {
            // manejo flexible de mayúsculas/minúsculas en la respuesta
            const capacidad = mesa.capacidad ?? mesa.Capacidad ?? null;
            const activa = (typeof mesa.activa !== "undefined") ? mesa.activa : (typeof mesa.Activa !== "undefined" ? mesa.Activa : false);

            const div = document.createElement("div");
            div.classList.add("mesa-card");

            div.innerHTML = `
                <h3>Mesa ${mesa.numero ?? mesa.Numero}</h3>
                <p><strong>Estado:</strong> ${mesa.estado ?? mesa.Estado ?? "—"}</p>
                <p><strong>Capacidad:</strong> ${capacidad ?? "No definida"}</p>
                <p><strong>Activa:</strong> ${activa ? "Sí" : "No"}</p>

                <div class="mesa-card-btns">
                    <button class="btn-editar" data-id="${mesa.idMesa ?? mesa.IdMesa}">✏ Editar</button>
                    <button class="btn-eliminar" data-id="${mesa.idMesa ?? mesa.IdMesa}">🗑 Eliminar</button>
                </div>
            `;

            contenedor.appendChild(div);
        });

        // delegación de eventos para editar/eliminar
        contenedor.querySelectorAll(".btn-editar").forEach(b => {
            b.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                editarMesa(Number(id));
            });
        });
        contenedor.querySelectorAll(".btn-eliminar").forEach(b => {
            b.addEventListener("click", (e) => {
                const id = e.currentTarget.getAttribute("data-id");
                eliminarMesa(Number(id));
            });
        });

    } catch (err) {
        console.error(err);
        alert("❌ No se pudieron cargar las mesas. Ver consola.");
    }
}

/* ---------------------------
   MODAL: crear / abrir / cerrar
   --------------------------- */
function crearModalHTML() {
    if (document.getElementById("modalMesa")) return; // ya existe

    const div = document.createElement("div");
    div.id = "modalMesa";
    div.classList.add("modal");

    div.innerHTML = `
        <div class="modal-content">
            <h2 id="modal-titulo-mesa">Nueva Mesa</h2>

            <label>Número:</label>
            <input type="number" id="form-numero" required>

            <label>Estado:</label>
            <input type="text" id="form-estado" placeholder="Libre / Ocupada / Reservada">

            <label>Capacidad:</label>
            <input type="number" id="form-capacidad" min="1" placeholder="Opcional">

            <label>
                <input type="checkbox" id="form-activa">
                Activa
            </label>

            <div class="modal-btns">
                <button id="btnGuardarMesa">💾 Guardar</button>
                <button id="btnCancelarMesa" class="btn-cancel">Cancelar</button>
                <button id="btnLimpiarMesa" class="btn-limpiar">Limpiar</button>
            </div>
        </div>
    `;

    document.body.appendChild(div);

    // listeners del modal (once)
    document.getElementById("btnCancelarMesa").addEventListener("click", cerrarModal);
    document.getElementById("btnLimpiarMesa").addEventListener("click", limpiarFormularioMesa);
    document.getElementById("btnGuardarMesa").addEventListener("click", guardarMesa);
}

function abrirModal(titulo = "Nueva Mesa") {
    crearModalHTML();
    const modal = document.getElementById("modalMesa");
    document.getElementById("modal-titulo-mesa").innerText = titulo;
    modal.classList.add("open");
    modal.style.display = "block";
}

function cerrarModal() {
    const modal = document.getElementById("modalMesa");
    if (!modal) return;
    modal.classList.remove("open");
    modal.style.display = "none";
    limpiarFormularioMesa();
}

/* ---------------------------
   LIMPIAR FORMULARIO
   --------------------------- */
function limpiarFormularioMesa() {
    const fn = id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    };
    fn("form-numero");
    fn("form-estado");
    fn("form-capacidad");
    const chk = document.getElementById("form-activa");
    if (chk) chk.checked = false;

    editando = false;
    idEditar = null;
}

/* ---------------------------
   OBTENER POR ID -> EDITAR
   --------------------------- */
async function editarMesa(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });
        if (!response.ok) {
            const txt = await response.text().catch(() => "");
            throw new Error(txt || response.status);
        }

        const mesa = await response.json();

        // ⚠️ IMPORTANTE: ABRIR EL MODAL PRIMERO
        idEditar = id;
        editando = true;
        abrirModal("Editar Mesa");

        // DESPUÉS setear los valores (el modal ya está en el DOM)
        const numero = mesa.numero ?? mesa.Numero;
        const estado = mesa.estado ?? mesa.Estado ?? "";
        const capacidad = mesa.capacidad ?? mesa.Capacidad ?? "";
        const activa = (typeof mesa.activa !== "undefined") ? mesa.activa : (typeof mesa.Activa !== "undefined" ? mesa.Activa : false);

        document.getElementById("form-numero").value = numero ?? "";
        document.getElementById("form-estado").value = estado;
        document.getElementById("form-capacidad").value = capacidad;
        document.getElementById("form-activa").checked = !!activa;

    } catch (err) {
        console.error(err);
        alert("❌ Error al obtener la mesa: " + err.message);
    }
}

/* ---------------------------
   GUARDAR (POST / PUT)
   --------------------------- */
async function guardarMesa() {
    try {
        const numeroVal = document.getElementById("form-numero").value;
        const estadoVal = document.getElementById("form-estado").value.trim();
        const capacidadRaw = document.getElementById("form-capacidad").value;
        const activaVal = document.getElementById("form-activa").checked;

        if (!numeroVal) {
            alert("El número es obligatorio.");
            return;
        }

        // capacidad nullable: si vacía => null
        const capacidad = capacidadRaw === "" ? null : parseInt(capacidadRaw, 10);

        const mesa = {
            IdMesa: idEditar ?? 0,
            Numero: parseInt(numeroVal, 10),
            Estado: estadoVal || null,  // Si está vacío, enviar null
            Capacidad: capacidad,
            Activa: activaVal
        };

        console.log("Enviando mesa:", mesa); // DEBUG

        const url = editando ? `${API_URL}/${idEditar}` : API_URL;
        const method = editando ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(mesa)
        });

        if (!response.ok) {
            const txt = await response.text().catch(() => "");
            throw new Error(txt || response.status);
        }

        // OK
        alert(editando ? "✔ Mesa actualizada" : "✔ Mesa creada");
        cerrarModal();
        await cargarMesas();

    } catch (err) {
        console.error(err);
        alert("❌ Error guardando la mesa: " + (err.message || err));
    }
}

/* ---------------------------
   ELIMINAR
   --------------------------- */
async function eliminarMesa(id) {
    if (!confirm("¿Eliminar la mesa?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        });

        if (!response.ok) {
            const txt = await response.text().catch(() => "");
            throw new Error(txt || response.status);
        }

        alert("✔ Mesa eliminada");
        await cargarMesas();
    } catch (err) {
        console.error(err);
        alert("❌ Error eliminando: " + (err.message || err));
    }
}