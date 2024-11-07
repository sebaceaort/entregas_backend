import { cartModel } from "./models/cart.model";

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
        const cart = await cartModel.findOne({_id:id});
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

    addProductToCart(cid, pid) {
        this.carts = this.getCarts();
        const cart = this.carts.find(item => item.id === cid);
        let product = cart.products.find(item => item.product === pid);

        if (product) {
            product.quantity+= 1;
        } else {
            cart.products.push({product:pid, quantity:1});
        }

        this.saveCart();
        console.log("Product added!");

        return true;
    }    
}

export default CartManager;