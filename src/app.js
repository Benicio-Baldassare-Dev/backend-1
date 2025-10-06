import express from "express"
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import ProductManager from "./models/productManager.js";
import CartManager from "./models/cartManager.js";

// Importar rutas
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

// Configuración de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

const productManager = new ProductManager("./src/data.json");
const cartManager = new CartManager("./src/cart.json");

// Configuración de rutas
app.use("/", viewsRouter);
app.use("/realtimeproducts", productsRouter);
app.use("/api/carts", cartsRouter);


// Configuración del servidor HTTP y WebSocket
const httpServer = app.listen(8080, () => {
    console.log("El servidor inició correctamente en el puerto 8080")
});

// Configuración de Socket.io
const io = new Server(httpServer);

// Configuración de Socket.io
io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    
    // Enviar lista de productos al cliente cuando se conecta
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products);
    
    // Escuchar evento para solicitar productos
    socket.on("requestProducts", async () => {
        try {
            const products = await productManager.getProducts();
            socket.emit("updateProducts", products);
        } catch (error) {
            console.error("Error al obtener productos:", error.message);
        }
    });
    
    // Escuchar evento para agregar un producto
    socket.on("addProduct", async (product) => {
        try {
            console.log("Producto recibido para agregar:", product);
            await productManager.addProduct(product);
            const updatedProducts = await productManager.getProducts();
            // Emitir a todos los clientes
            io.emit("updateProducts", updatedProducts);
        } catch (error) {
            console.error("Error al agregar producto:", error.message);
        }
    });
    
    // Escuchar evento para eliminar un producto
    socket.on("deleteProduct", async (productId) => {
        try {
            await productManager.deleteProductById(productId);
            const updatedProducts = await productManager.getProducts();
            // Emitir a todos los clientes
            io.emit("updateProducts", updatedProducts);
        } catch (error) {
            console.error("Error al eliminar producto:", error.message);
        }
    });
    
    // Escuchar evento para actualizar un producto
    socket.on("updateProduct", async (productData) => {
        try {
            await productManager.setProductById(productData.id, productData.updates);
            const updatedProducts = await productManager.getProducts();
            io.emit("updateProducts", updatedProducts);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
        }
    });
});