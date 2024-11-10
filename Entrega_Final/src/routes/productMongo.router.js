import { Router } from "express";
import ProductManagerMongo from "../dao/productManagerMongo.js";

const PM= new ProductManagerMongo();
const productMongoRouter = Router();

productMongoRouter.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    try {
        const products = await PM.getProducts(limit, page, sort, query);
        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

productMongoRouter.get("/:id", async (req, res) => {
    let id = req.params.id;
    try {
      let product = await PM.getProductById(id);
      res.status(200).send(product);
    } catch (error) {
      console.log(error);
      res.status(400).send("not found");
    }
  })
  
  productMongoRouter.post("/", (req, res) => {
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
          res.json("Producto agregado correctamente!");
      } else {
          res.status(500).send({status:"error", message:"Error! No se pudo agregar el Producto!"});
      }
  });
  
  productMongoRouter.put("/:pid", (req, res) => {
      let pid = req.params.pid;
      let product = {...req.body};    
  
      if (PM.updateProduct(pid, product)) {
          res.send({status:"ok", message:"El Producto se actualizó correctamente!"});
      } else {
          res.status(500).send({status:"error", message:"Error! No se pudo actualizar el Producto!"});
      }
  });
  
  productMongoRouter.delete("/:pid", (req, res) => {
      let pid = req.params.pid;
  
      if (PM.deleteProduct(pid)) {
          res.json("Producto eliminado correctamente!");
      } else {
          res.status(500).send({status:"error", message:"Error! No se pudo eliminar el Producto!"});
      }
  });


export default productMongoRouter;