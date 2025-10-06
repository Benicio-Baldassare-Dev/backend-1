import { Router } from "express";
import ProductManager from "../models/productManager.js";
import CartManager from "../models/cartManager.js";

const router = Router();
const productManager = new ProductManager("./src/data.json");
const cartManager = new CartManager("./src/cart.json");

// Ruta principal - Lista de productos
router.get("/", async(req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// Ruta de productos en tiempo real
router.get("/realtimeproducts", async(req, res) => {
    try {
        res.render("realTimeProducts");
    } catch (error) {
        res.status(500).render("error", { error: error.message });
    }
});

// Ruta de carrito
router.get("/cart/:cid", async(req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        res.render("cart", { products: cart.products });
    } catch (error) {
        res.status(404).render("error", { error: error.message });
    }
});

export default router;