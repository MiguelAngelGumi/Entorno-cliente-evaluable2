let productos = [];
let carrito = [];
const conversionRate = 0.92; // 1 USD = 0.92 EUR

//1 lanzo la peticion al server.
// 2 con el them analizo la respuesta
//3 dentro de ese then la paso a json()
//4 en otro them analizo la respuesta de la traduccion
//5 trato la respuesta
// await -> espera. indica que la funcion donde esta aplicada es una promesa y no tengo que usar el them para obtener la respuesta.
//async -> asincrono, indica aquellas funcion donde se aplica el modificador await que tiene que ser asincrono.

// Función para cargar productos del API
async function cargarProductos() {
  const responde = await fetch("https://dummyjson.com/products");
  const data = await responde.json();
  productos = data.products;
  mostrarProductos(productos);
}

// Mostrar productos en la parte de resultados
function mostrarProductos(productosFiltrados) {
  const productosContainer = document.querySelector(".productos");
  productosContainer.innerHTML = "";
  productosFiltrados.forEach((producto) => {
    const productoCard = document.createElement("div");
    productoCard.classList.add("card", "animate__animated", "animate__fadeIn");
    productoCard.innerHTML = `
            <img src="${producto.thumbnail}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p>Precio: ${(producto.price * conversionRate).toFixed(2)}€</p>
            <p>Categoría: ${producto.category}</p>
            <button onclick="añadirAlCarrito(${
              producto.id
            })">Añadir al carrito</button>
        `;
    productosContainer.appendChild(productoCard);
  });
}

// Filtrar productos
function aplicarFiltros() {
  const minPrice = Number(document.getElementById("minPrice").value);
  const categoria = document.getElementById("category").value.toLowerCase();
  const marca = document.getElementById("brand").value.toLowerCase();

  const productosFiltrados = productos.filter((producto) => {
    return (
      (!minPrice || producto.price >= minPrice) &&
      (!categoria || producto.category.toLowerCase().includes(categoria)) &&
      (!marca || producto.brand.toLowerCase().includes(marca))
    );
  });

  mostrarProductos(productosFiltrados);
}

// Añadir producto al carrito
function añadirAlCarrito(productoId) {
  const producto = productos.find((p) => p.id === productoId);
  carrito.push(producto);
  actualizarCarrito();
}

// Actualizar vista del carrito
function actualizarCarrito() {
  const carritoContainer = document.getElementById("cartItems");
  carritoContainer.innerHTML = "";
  carrito.forEach((item, index) => {
    const carritoItem = document.createElement("div");
    carritoItem.classList.add("cart-item");
    carritoItem.innerHTML = `
            <span>${item.title} - ${(item.price * conversionRate).toFixed(
      2
    )}€</span>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
    carritoContainer.appendChild(carritoItem);
  });
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Comprar productos
function comprar() {
  const total = carrito.reduce(
    (sum, item) => sum + item.price * conversionRate,
    0
  );
  Swal.fire({
    title: "Confirmar Compra",
    text: `Vas a realizar una compra por valor de ${total.toFixed(
      2
    )}€. ¿Estás seguro?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      actualizarCarrito();
      Swal.fire("¡Compra realizada!", "Tu carrito está vacío.", "success");
    }
  });
}

document
  .getElementById("applyFilters")
  .addEventListener("click", aplicarFiltros);
document.getElementById("purchaseButton").addEventListener("click", comprar);

// Cargar productos al inicio
cargarProductos();
