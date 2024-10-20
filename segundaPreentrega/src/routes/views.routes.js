import express from "express";
import  ProductManager from "../dao/productManagerMongo.js";

const PM= new ProductManager();
const Router = express.Router();

Router.get("/", async (req, res) => {
    try {
        const products = await PM.getProducts();

        res.render("home", { title: "Productos", products });
    } catch (error) {
        res.status(500).json({ message: "algo salio mal" });
    }
}
);
Router.get("/realtimeproducts",async (req, res) => {
    try {
        await PM.loadProducts();
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

Router.get("/chat", (req, res) => {
    res.render("chat");
});

export default Router;