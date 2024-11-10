import express from "express";
import mongoose from "mongoose";
import {Server} from "socket.io";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import productsFSRouter from "./routes/productFS.router.js";
import productsMongoRouter from "./routes/productMongo.router.js";
import cartsRouter from "./routes/cart.router.js";
import ChatManager from "./dao/chatManager.js";

const app = express();
const puerto = 8080;
const httpServer = app.listen(puerto, () => {
    console.log(`Servidor Activo en el puerto: ${puerto}`);
});
 export const socketServer = new Server(httpServer);

 mongoose.connect("mongodb+srv://sceaort:hcaD7dqwi1Oexap3@coderbackend.pobdwe8.mongodb.net/ecommerce?retryWrites=true&w=majority");
// Defino mis plantillas en mi Servidor HTTP
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/FS/products", productsFSRouter);
app.use("/api/products", productsMongoRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// const CM = new ChatManager()

// Defino los mensajes en mi Servidor Socket
socketServer.on("connection", (socket) => {
    console.log("Nueva Conexión!");
    socket.emit("connection");

    // socket.on("newMessage", async (data) => {
    //     CM.createMessage(data);
    //     const messages = await CM.getMessages();
    //     socket.emit("messages", messages);
    // });
});

