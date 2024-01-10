const express = require("express");
const {ProductManager}= require("./productManager.js");
const pm = new ProductManager("products.json")

const puerto = 8080;
const server = express();

server.use(express.json())
server.use(express.urlencoded({extended: true}))

server.get("/products", async (req, res) => {
    let limit = req.query.limit
    let products = await pm.getProducts()
    if(limit) {
        let filteredProducts = products.slice(0, limit)
        res.status(200).send(filteredProducts)
    } else {
        res.status(200).send(products)
    }
})

server.get("/products/:id", async (req, res) => {
    let id = req.params.id
    res.status(200).send(await pm.getProductById(id))
})


server.listen(puerto, () => {
    console.log(`Server listening on PORT:${puerto}`)
})
