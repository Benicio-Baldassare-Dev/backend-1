import fs from "fs/promises"

class CartManager{
    constructor(path){
        this.path = path || "./cart.json"
    }

    generateId = (carts) => {
        if(carts.length > 0){
            return carts[carts.length - 1].id + 1;
        }else{
            return 1 
        }
    }

    getCarts = async() => {
        try {
            // Intentar leer el archivo
            const cartJson = await fs.readFile(this.path, 'utf-8');
            // Si el archivo existe y tiene contenido, parsearlo
            if(cartJson.trim()) {
                return JSON.parse(cartJson);
            }
            return [];
        } catch (error) {
            // Si el archivo no existe, retornamos un array vacío
            if(error.code === 'ENOENT') {
                return [];
            }
            throw error; // Si es otro error, lo propagamos
        }
    }

    getCartById = async(cartId) => {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === parseInt(cartId));
        if(!cart) {
            throw new Error(`No se encontró el carrito con id ${cartId}`);
        }
        return cart;
    }

    addProductCart = async() => {
        let carts = await this.getCarts();

        const id = this.generateId(carts);
        carts.push({id, products: []});

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        return carts;
    }

    addProductToCart = async(cartId, productId, quantity = 1) => {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
        
        if(cartIndex === -1) {
            throw new Error(`No se encontró el carrito con id ${cartId}`);
        }
        
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(prod => prod.productId === parseInt(productId));
        
        if(productIndex !== -1) {
            // Si el producto ya existe en el carrito, incrementamos la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe en el carrito, lo agregamos
            cart.products.push({
                productId: parseInt(productId),
                quantity
            });
        }
        
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        return cart;
    }
}

export default CartManager;