import { Router } from "express";
import ProductManager from "../models/productManager.js";

const router = Router();
const productManager = new ProductManager("./src/data.json");

// Obtener todos los productos
router.get("/", async(req, res) => {
    try {
        // Formato JSON para API
        const format = req.query.format;
        
        if (format === 'page') {
            // Renderizar vista con WebSockets para actualización en tiempo real
            return res.render("api-products");
        }
        
        // Respuesta JSON tradicional
        const products = await productManager.getProducts();
        res.status(200).json({ message: "Lista de productos:", products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto
router.delete("/:pid", async(req, res) => {
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.json({message: "Producto Eliminado", products});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Agregar un producto
router.post("/", async(req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.json({ message: "Producto añadido", products });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto
router.put("/:pid", async(req, res) => {
    try {
        const pid = req.params.pid;
        const updates = req.body;

        const products = await productManager.setProductById(pid, updates);
        res.json({ message: "Se actualizó el producto", products})
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;