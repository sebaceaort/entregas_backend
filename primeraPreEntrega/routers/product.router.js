import { Router } from "express";
import  ProductManager  from "../utils/productManager.js";

const PM = new ProductManager("./products.json");

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  let limit = req.query.limit;
  try {
    let products = await PM.getProducts();
    if (limit) {
      let filteredProducts = products.slice(0, limit);
      res.status(200).send(filteredProducts);
    } else {
      res.status(200).send(products);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

productsRouter.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let product = await PM.getProductById(id);
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(400).send("not found");
  }
})

productsRouter.post("/", (req, res) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Title!"});
        return false;
    }

    if (!description) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Description!"});
        return false;
    }

    if (!code) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Code!"});
        return false;
    }

    if (!price) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Price!"});
        return false;
    }

    if (!status) {
        status = true;
    }
    if(!thumbnails){
        thumbnails = [];
    }

    if (!stock) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Stock!"});
        return false;
    }

    if (!category) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Category!"});
        return false;
    }
    if (PM.addProduct({title, description, code, price, status, stock, category, thumbnails})) {
        res.send({status:"ok", message:"El Producto se agregó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! No se pudo agregar el Producto!"});
    }
});

productsRouter.put("/:pid", (req, res) => {
    let pid = Number(req.params.pid);
    let product = {...req.body};    

    if (PM.updateProduct(pid, product)) {
        res.send({status:"ok", message:"El Producto se actualizó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! No se pudo actualizar el Producto!"});
    }
});

productsRouter.delete("/:pid", (req, res) => {
    let pid = Number(req.params.pid);

    if (PM.deleteProduct(pid)) {
        res.send({status:"ok", message:"El Producto se eliminó correctamente!"});
    } else {
        res.status(500).send({status:"error", message:"Error! No se pudo eliminar el Producto!"});
    }
});


export default productsRouter;


