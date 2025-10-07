import { Router } from "express";
import CartManager from "../models/cartManager.js";

const router = Router();
const cartManager = new CartManager("./src/cart.json");

// Mostrar todos los carritos (vista HTML)
router.get("/", async(req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.render("cart", { carts });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// Crear un nuevo carrito
router.post("/", async(req, res) => {
    try {
        const carts = await cartManager.addProductCart();
        res.status(201).json({message: "Se creó un nuevo carrito", carts});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Listar los productos de un carrito específico
router.get("/:cid", async(req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.status(200).json({message: "Productos del carrito:", products: cart.products});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

// Agregar un producto a un carrito específico
router.post("/:cid/product/:pid", async(req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(200).json({message: "Producto agregado al carrito", cart: updatedCart});
    } catch (error) {
        res.status(404).json({error: error.message});
    }
});

export default router;