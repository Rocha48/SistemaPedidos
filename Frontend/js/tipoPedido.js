function seleccionarTipo(tipo) {

    // Guardar tipo de pedido
    localStorage.setItem("tipoPedido", tipo);

    // Reiniciar valores previos
    localStorage.removeItem("mesa");
    localStorage.removeItem("mesaSeleccionada");

    if (tipo === "local") {
        
        window.location.href = "../totem/mesa.html";
    } 
    else {
        // Si es para llevar, guardamos un valor estándar
        localStorage.setItem("mesa", "No corresponde");
        window.location.href = "../totem/menu.html";
    }
}
