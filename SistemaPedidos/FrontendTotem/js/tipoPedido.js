function seleccionarTipo(tipo) {

    localStorage.setItem("tipoPedido", tipo);

    if (tipo === "local") {
        // vamos a pedir mesa
        window.location.href = "mesa.html";
    } else {
        // va directo al menú
        window.location.href = "menu.html";
    }
}
