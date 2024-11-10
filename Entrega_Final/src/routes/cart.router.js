import { Router } from "express";
import CartManager from "../dao/cartManagerMongo.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", async (req, res) => {
    if (CM.newCart()) {
        res.send({status:"ok", message:"El Carrito se creó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! No se pudo crear el Carrito!"});
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);
        
    if (cart) {
        res.send({products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }
});
cartsRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    if (await CM.deleteCart(cid)) {
        res.send({status:"ok", message:"Se eliminaron los productos del Carrito!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }

});
cartsRouter.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    try {
    if (await CM.updateCart(cid, products)) {
        res.send({status:"ok", message:"Se actualizo el Carrito!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }}catch (error) {
        console.log(error);
        res.status(500).send({status:"error", message:"Error! No se pudo actualizar el Carrito!"});
    }
})

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = CM.getCart(cid);

    if (cart) {
        if (await CM.addProductToCart(cid, pid)) {
            res.send({status:"ok", message:"El producto se agregó correctamente!"});
        } else {
            res.status(400).send({status:"error", message:"Error! No se pudo agregar el Producto al Carrito!"});
        }
    } else {
        res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = CM.getCart(cid);
    try {
        if (cart) {
            if (await CM.deleteProductFromCart(cid, pid)) {
                res.send({status:"ok", message:"El producto se eliminó correctamente!"});
            } else {
                res.status(400).send({status:"error", message:"Error! No se pudo eliminar el Producto del Carrito!"});
            }
        } else {
            res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
        }
    }catch (error) {
        console.log(error);
        res.status(500).send({status:"error", message:"Error! No se pudo eliminar el Producto del Carrito!"});
    }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const cart = CM.getCart(cid);
    try {
        if (cart) {
            if (await CM.updateProductInCart(cid, pid, quantity)) {
                res.send({status:"ok", message:"El producto se actualizó correctamente!"});
            } else {
                res.status(400).send({status:"error", message:"Error! No se pudo actualizar el Producto del Carrito!"});
            }
        } else {
            res.status(400).send({status:"error", message:"Error! No se encuentra el ID de Carrito!"});
        }
    }catch (error) {
        console.log(error);
        res.status(500).send({status:"error", message:"Error! No se pudo actualizar el Producto del Carrito!"});
    }
});

export default cartsRouter;