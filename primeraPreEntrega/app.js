import Express from "express";
import productsRouter from "./routers/product.router.js";
import cartsRouter from "./routers/cart.router.js";


const app = Express();
const puerto= 8080;

app.use(Express.json());
app.use(Express.urlencoded({extended: true}));

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

app.listen(puerto, () => {
    console.log(`Server listening on PORT:${puerto}`)
})


