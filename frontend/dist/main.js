var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const isLogged = Boolean(username);
    const btnCarrito = document.getElementById("btnCarrito");
    const btnInicio = document.getElementById("btnInicio");
    const btnLogout = document.getElementById("btnLogout");
    const btnUsuario = document.getElementById("btnUsuario");
    const btnRegister = document.getElementById("btnRegister");
    const adminLink = document.getElementById("adminLink");
    if (btnUsuario && username) {
        btnUsuario.textContent = username;
    }
    if (adminLink) {
        adminLink.style.display = role === "admin" ? "block" : "none";
        adminLink.addEventListener("click", () => (window.location.href = "/admin"));
    }
    btnCarrito === null || btnCarrito === void 0 ? void 0 : btnCarrito.addEventListener("click", () => (window.location.href = "/carrito"));
    btnInicio === null || btnInicio === void 0 ? void 0 : btnInicio.addEventListener("click", () => (window.location.href = "/"));
    btnUsuario === null || btnUsuario === void 0 ? void 0 : btnUsuario.addEventListener("click", () => {
        if (username) {
            // Aquí irá el perfil de usuario
        }
        else {
            window.location.href = "/login";
        }
    });
    if (btnRegister) {
        btnRegister.style.display = isLogged ? "none" : "block";
        btnRegister.addEventListener("click", () => (window.location.href = "/register"));
    }
    if (btnLogout) {
        btnLogout.style.display = isLogged ? "block" : "none";
        btnLogout.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            yield fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            localStorage.clear();
            window.location.href = "/";
        }));
    }
    function loadProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch("/api/products", { credentials: "include" });
                if (!res.ok)
                    throw new Error("Error al cargar productos");
                const products = yield res.json();
                const container = document.getElementById("product-list");
                if (!container)
                    return;
                container.innerHTML = products
                    .map((p) => {
                    var _a, _b, _c;
                    return `
          <div class="border border-gray-600 rounded-lg p-4 text-center bg-gray-800 text-white">
            <img src="${p.image_url || "/assets/img/logoFP.png"}" alt="${p.name}" class="mx-auto w-24 h-24 object-cover rounded-md mb-2"/>
            <h3 class="text-lg font-semibold">${p.name}</h3>
            <p class="text-sm text-gray-300">${(_a = p.description) !== null && _a !== void 0 ? _a : "Sin descripción"}</p>
            <p class="mt-2 font-bold text-cyan-400">$${p.price}</p>
            <p class="text-sm text-gray-400">Stock: ${(_b = p.stock) !== null && _b !== void 0 ? _b : "N/A"}</p>
            <p class="text-sm text-gray-400">Categoría: ${(_c = p.category) !== null && _c !== void 0 ? _c : "General"}</p>
          </div>`;
                })
                    .join("");
            }
            catch (error) {
                console.error("Error:", error);
            }
        });
    }
    yield loadProducts();
}));
export {};
//# sourceMappingURL=main.js.map