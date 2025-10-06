// Conexión con Socket.io
const socket = io();

// Para la página de productos en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productsContainer = document.getElementById('productsContainer');
    
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const product = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                price: document.getElementById('price').value,
                category: document.getElementById('category').value,
                stock: document.getElementById('stock').value
            };
            
            socket.emit('addProduct', product);
            productForm.reset();
        });
    }
    
    // Escuchar actualizaciones de productos
    socket.on('updateProducts', (products) => {
        if (productsContainer) {
            updateProductsList(products);
        }
    });
    
    // Función para actualizar la lista de productos
    function updateProductsList(products) {
        productsContainer.innerHTML = '';
        
        if (products.length === 0) {
            productsContainer.innerHTML = '<p>No hay productos disponibles</p>';
            return;
        }
        
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = `
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <p>Categoría: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
                <button onclick="deleteProduct('${product.id}')">Eliminar</button>
            `;
            productsContainer.appendChild(productElement);
        });
    }
});

// Función para eliminar un producto
function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}