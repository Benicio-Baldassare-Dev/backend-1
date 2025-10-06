// Conexión con Socket.io
const socket = io();

// Para la página de productos en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productsContainer = document.getElementById('productsContainer');
    
    // Solicitar actualización de productos al conectar
    socket.emit('requestProducts');
    
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const product = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                price: parseFloat(document.getElementById('price').value),
                category: document.getElementById('category')?.value || '',
                stock: parseInt(document.getElementById('stock')?.value || 0)
            };
            
            // Emitir evento para agregar producto
            socket.emit('addProduct', product);
            console.log('Producto enviado:', product);
            productForm.reset();
        });
    }
    
    // Escuchar actualizaciones de productos
    socket.on('updateProducts', (products) => {
        console.log('Productos actualizados recibidos:', products);
        if (productsContainer) {
            updateProductsList(products);
        }
    });
    
    // Función para actualizar la lista de productos
    function updateProductsList(products) {
        productsContainer.innerHTML = '';
        
        if (!products || products.length === 0) {
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
                <p>Categoría: ${product.category || 'N/A'}</p>
                <p>Stock: ${product.stock || 'N/A'}</p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
                <button class="delete-product" data-id="${product.id}">Eliminar</button>
            `;
            productsContainer.appendChild(productElement);
        });
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-id');
                socket.emit('deleteProduct', productId);
            });
        });
    }
});