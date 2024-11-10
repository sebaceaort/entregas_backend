import express from "express";
import  ProductManager from "../dao/productManagerMongo.js";
import CartManager from "../dao/cartManagerMongo.js";

const PM= new ProductManager();
const CM= new CartManager();
const Router = express.Router();

Router.get("/product/:id",async (req, res) => {
    console.log('a'+req.params.id);
    let id = req.params.id;
    const product = await PM.getProductById(id);
    product?
       res.render("product.handlebars", { title:product?.title, product })
       :
       res.status(500).json({ message: "algo salio mal" });
    
})
Router.get("/realtimeproducts",async (req, res) => {
    try {
        //await PM.loadProducts();
        const products = await PM.getProducts();
        console.log(products);
        res.render("realTimeProducts", {
            title: "Real Time Products",
            products,
        });
    } catch (error) {
        res.status(500).json({ message: "algo salio mal" });
    }
});
Router.get("/products", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;
    try {
        const products = await PM.getProducts(limit, page, sort, query);

        res.render("home.handlebars", { title: "Productos", products });
    } catch (error) {
        res.status(500).json({ message: "algo salio mal" });
    }
}
);

Router.get("/cart/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);
    let products=cart.products;
    
    if (cart) {
        res.render("cart.handlebars", { title: "Carrito", products });
        } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }
});


// Router.get("/chat", (req, res) => {
//     res.render("chat");
// });

export default Router;