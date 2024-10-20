import { productModel } from "../dao/models/product.model.js";

class ProductManagerMongo {
  validaProducto(producto) {
    return (
      producto.title.trim().length !== 0 &&
      producto.description.trim().length !== 0 &&
      parseFloat(producto.price) > 0 &&
      producto.category.trim().length !== 0 &&
      producto.code.trim().length !== 0 &&
      parseInt(producto.stock) >= 0
    );
  }

  async validaCodigo(codigo) {
    return await productModel.findOne({ code: codigo }) || false;
  }
  async addProduct(product) {
    if (!this.validaProducto(product)) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (await this.validaCodigo(product.code)) {
      console.log("El código del producto ya existe");
      return;
    }

    await productModel.create(product);
    console.log("Producto agregado correctamente");
  }

  async getProducts() {
    try {
      const data = await productModel.find().lean();
      return data;
    } catch (error) {
      console.log("No se pudo acceder a la base de datos");
    }
  }

  async getProductById(id) {
    try {
      const data = await productModel.findOne({ _id: id }).lean();
      return data;
    } catch (error) {
      console.log("No encontrado");
    }
  }

  async updateProduct(id, updatedFields) {
    if (this.validaCodigo(id)) {
      const product = await productModel.findOne({ code: id });
      const updatedProduct = {
        ...product,
        ...updatedFields,
      };
      if (this.validaProducto(updatedProduct)) {
        try {
          await productModel.updateOne({ _id: id }, updatedProduct);
        } catch {
          console.log("No se pudo actualizar el producto");
          return;
        }
      } else {
        console.log("No se pudo encontrar el producto");
        return;
      }
    }
  }
  async deleteProduct(id) {
    try {
      await productModel.deleteOne({ _id: id });
      return true;
    } catch {
      console.log("No se pudo eliminar el producto");
      return false;
    }
  }
}
export default ProductManagerMongo;
