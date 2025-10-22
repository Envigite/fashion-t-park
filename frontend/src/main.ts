document.addEventListener('DOMContentLoaded', () => {
    const btnCarrito = document.getElementById('btnCarrito')
    const btnInicio = document.getElementById('btnInicio')

    if (btnCarrito) {
        btnCarrito.addEventListener("click", () => {
            window.location.href = "/carrito"
        })
    }

    if (btnInicio) {
        btnInicio.addEventListener("click", () => {
            window.location.href = "/"
        })
    }
})