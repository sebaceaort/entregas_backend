const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.productsFile = path;
    this.productId = 1;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.productsFile, "utf8");
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

  saveProducts() {
    try {
      const data = JSON.stringify(this.products);
      fs.writeFileSync(this.productsFile, data, "utf8");
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
  addProduct(product) {
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
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);

    if (product) {
      return product;
    } else {
      throw new Error("Not found");
    }
  }

  updateProduct(id, updatedFields) {
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
      this.saveProducts();
      console.log("Producto actualizado correctamente");
    } else {
      console.log("No se pudo actualizar el producto");
      return;
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      console.log("No se encontró ningún producto con el ID especificado");
      return;
    }

    this.products.splice(productIndex, 1);

    this.saveProducts();

    console.log("Producto eliminado correctamente");
  }
}

const producto1 = {
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};
const producto2 = {
  title: "producto prueba2",
  description: "Este es un producto prueba2",
  price: 2000,
  thumbnail: "Sin imagen",
  code: "abc1232",
  stock: 25,
};

const manager = new ProductManager("./products.json");
console.log(manager.getProducts());
manager.addProduct(producto1);
console.log(manager.getProducts());
console.log("-----------------------------------------------------------");
manager.addProduct(producto1);
console.log(
  "------------------------addProduct-----------------------------------"
);
console.log(manager.getProducts());
manager.addProduct(producto2);
console.log(
  "--------------------------getProductById caso id esta---------------------------------"
);
console.log(manager.getProductById(2));
// console.log("----------------------------getProductById caso id NO esta-------------------------------")
// console.log(manager.getProductById(4));
console.log(
  "--------------------------updateProduct varios test---------------------------------"
);
console.log(manager.updateProduct(1, { title: "" }));
console.log(manager.updateProduct(1, { price: -20 }));
console.log(manager.updateProduct(1, { title: "Prueba 3 actualizado" }));
console.log(manager.getProductById(1));
//  console.log("------------------------updateProduct id no esta-----------------------------------")
//  console.log(manager. updateProduct(4, { title: 'Prueba 3 actualizado' }));
console.log(
  "--------------------------deleteProduct id que esta---------------------------------"
);
manager.deleteProduct(1);
console.log(manager.getProducts());
// console.log(
//   "----------------------------deleteProduct id NO esta-------------------------------"
// );
// manager.deleteProduct(4);
