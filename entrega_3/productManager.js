const fs = require("fs");

 class ProductManager {
   constructor(path) {
    this.productsFile = path;
    this.productId = 1;
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.productsFile, "utf8");
      this.products = JSON.parse(data);
      const lastProductId =
        this.products.length > 0
          ? this.products[this.products.length - 1].id
          : 0;
      this.productId = lastProductId + 1;
    } catch (error) {
      console.log(
        "No se pudo cargar el archivo de productos. Se creará uno nuevo."
      );
      this.products = [];
    }
  }

  async saveProducts() {
    try {
      const data = JSON.stringify(this.products);
      await fs.promises.writeFile(this.productsFile, data, "utf8");
      //console.log('Productos guardados correctamente.');
    } catch (error) {
      console.log("No se pudo guardar el archivo de productos.");
    }
  }

  validaProducto(producto) {
    return (
      producto.title.trim().length !== 0 &&
      producto.description.trim().length !== 0 &&
      parseFloat(producto.price) > 0 &&
      producto.thumbnail.trim().length !== 0 &&
      producto.code.trim().length !== 0 &&
      parseInt(producto.stock) >= 0
    );
  }
  async addProduct(product) {
    if (!this.validaProducto(product)) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((p) => p.code === product.code)) {
      console.log("El código del producto ya existe");
      return;
    }

    product.id = this.productId;
    this.products.push(product);
    this.productId++;

    console.log("Producto agregado correctamente");
    await this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    id=parseInt(id)
    const product = this.products.find((p) => p.id === id);

    if (product) {
      return product;
    } else {
      throw new Error("Not found");
    }
  }

  async updateProduct(id, updatedFields) {
    id=parseInt(id)
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      console.log("No se encontró ningún producto con el ID especificado");
      return;
    }

    const updatedProduct = { ...this.products[productIndex], ...updatedFields };
    if (
      this.validaProducto(updatedProduct) &&
      Object.keys(updatedProduct).length == 7
    ) {
      this.products[productIndex] = updatedProduct;
      await this.saveProducts();
      console.log("Producto actualizado correctamente");
    } else {
      console.log("No se pudo actualizar el producto");
      return;
    }
  }

  async deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      console.log("No se encontró ningún producto con el ID especificado");
      return;
    }

    this.products.splice(productIndex, 1);

    await this.saveProducts();

    console.log("Producto eliminado correctamente");
  }
}


module.exports = { ProductManager };