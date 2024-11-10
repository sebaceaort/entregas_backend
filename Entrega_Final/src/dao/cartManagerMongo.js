import { cartModel } from "../dao/models/cart.model.js";

class CartManager {
    async newCart() {
        try{
            const cart = await cartModel.create({products:[]});
            return cart;
        }catch(error){
            console.log(error);
        }
    }

  async getCart(id) {
       try{
        const cart = await cartModel.findOne({_id:id}).populate("products.product").lean();
        return cart;
       }catch(error){
           console.log(error);
       }
    }

   async getCarts() {
       try{
        const carts = await cartModel.find();
        return carts;
       }catch(error){
           console.log(error);
       }
    }

    async addProductToCart(cid, pid) {
        const  cart = await this.getCart(cid);
        let product = cart.products.find(item => {
            return item.product._id == pid});
        
        if (product) {
            product.quantity+= 1;
        } else {
            cart.products.push({product:pid, quantity:1});
        }
        let result = await cartModel.updateOne({_id:cid}, cart);
        
        console.log("Product added!");

        return true;
    }  
    async deleteProductFromCart(cid, pid) {
        try{
        const  cart = await this.getCart(cid);
        let index = cart.products.findIndex(item => {
            return item.product._id == pid});
        if (index > -1) {
            cart.products.splice(index, 1);            
        } 
        let result = await cartModel.updateOne({_id:cid}, cart);
        console.log("Product deleted!");
        return result;
        }catch(error){
            console.log(error);
            return{status:"error", message:"Error! No se encuentra el ID de Carrito!"};
        }
    }  

    async deleteCart(cid) {
        try{
        const  cart = await this.getCart(cid);
        cart.products=[];
        let result = await cartModel.updateOne({_id:cid}, cart);
        
        console.log("Cart deleted!");

        return result;
        }catch(error){
            console.log(error);
            return{status:"error", message:"Error! No se encuentra el ID de Carrito!"};
        }
    }

    async updateProductInCart(cid, pid, quantity) {
        try{
        const  cart = await this.getCart(cid);
        let index = cart.products.indexOf(item => {
            return item.product._id == pid});
        
        if (index > -1) {
            cart.products[index].quantity = quantity;            
        } 
        let result = await cartModel.updateOne({_id:cid}, cart);
        console.log("Product updated!");
        return result;
        }catch(error){
            console.log(error);
            return{status:"error", message:"Error! No se encuentra el ID de Carrito!"};
        }
    }   

    async updateCart(cid, products) {
        try{
        const  cart = await this.getCart(cid);
        cart.products = products;
        let result = await cartModel.updateOne({_id:cid}, cart);
        console.log("Cart updated!");
        return result;
        }catch(error){
            console.log(error);
            return{status:"error", message:"Error! No se encuentra el ID de Carrito!"};
        }
    }
}

export default CartManager;