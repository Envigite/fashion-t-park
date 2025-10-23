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

async function loadProducts() {
   const res = await fetch('/api/products');
    const products = await res.json();
    
    const container = document.getElementById('product-list')!;
    container.innerHTML = products.map(
        (p: any) =>
            `<div>
                <img src="${p.image_url}" alt="${p.name}" width="100" />
                <h3>${p.name}</h3>
                <p>$${p.price}</p>
            </div>`
    )
    .join("");
}

loadProducts();