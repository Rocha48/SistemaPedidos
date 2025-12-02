function seleccionarTipo(tipo) {
    // Guardar tipo de pedido con el nombre correcto
    if (tipo === "local") {
        localStorage.setItem("tipoPedido", "Local");
        window.location.href = "../totem/mesa.html";
    } else {
        localStorage.setItem("tipoPedido", "Para Llevar");
        localStorage.setItem("mesaSeleccionada", "0"); // No hay mesa
        window.location.href = "../totem/menu.html";
    }
}
