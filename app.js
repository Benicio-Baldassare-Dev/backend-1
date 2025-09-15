import express from "express"
import ProductManager from "./productManager.js";
import CartManager from "./cartManager.js";

const app = express();
app.use(express.json());
const productManager = new ProductManager("./data.json");
const cartManager = new CartManager("./cart.json");

app.get("/", async(req, res) => {
    res.json("Hola Mundo")
})

app.get("/api/products", async(req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json({ message: "Lista de productos:", products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.delete("/api/products/:pid", async(req, res) => {
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.json({message: "Producto Eliminado", products});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

app.post("/api/products", async(req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.json({ message: "Producto añadido", products });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.put("/api/products/:pid", async(req, res) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;

        const products = await productManager.setProductById(pid, updates);
        res.json({ message: "Se actualizó el producto", products})
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

// Rutas de Carrito

// Crear un nuevo carrito
app.post("/api/carts", async(req, res) => {
    try {
        const carts = await cartManager.addProductCart();
        res.status(201).json({message: "Se creó un nuevo carrito", carts});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Listar los productos de un carrito específico
app.get("/api/carts/:cid", async(req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.status(200).json({message: "Productos del carrito:", products: cart.products});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

// Agregar un producto a un carrito específico
app.post("/api/carts/:cid/product/:pid", async(req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(200).json({message: "Producto agregado al carrito", cart: updatedCart});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
})


app.listen(8080, () => {
    console.log("El servidor inicio correctamente")
})