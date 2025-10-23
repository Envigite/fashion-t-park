"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const btnCarrito = document.getElementById('btnCarrito');
    const btnInicio = document.getElementById('btnInicio');
    if (btnCarrito) {
        btnCarrito.addEventListener("click", () => {
            window.location.href = "/carrito";
        });
    }
    if (btnInicio) {
        btnInicio.addEventListener("click", () => {
            window.location.href = "/";
        });
    }
});
function loadProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('/api/products');
        const products = yield res.json();
        const container = document.getElementById('product-list');
        container.innerHTML = products.map((p) => `<div>
                <img src="${p.image_url}" alt="${p.name}" width="100" />
                <h3>${p.name}</h3>
                <p>$${p.price}</p>
            </div>`)
            .join("");
    });
}
loadProducts();
//# sourceMappingURL=main.js.map