import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import {Server} from "socket.io";
import productsRouter from "./routes/product.router.js";

const app = express();
const puerto = 8080;
const httpServer = app.listen(puerto, () => {
    console.log("Servidor Activo en el puerto: " + puerto);
});
 export const socketServer = new Server(httpServer);

// Defino mis plantillas en mi Servidor HTTP
app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);

const mensajes = []; //Array de mensajes
const generarId = () => { return mensajes.length + 1}; //Función que genera Socket ID

// Defino los mensajes en mi Servidor Socket
socketServer.on("connection", (socket) => {
    console.log("Nueva Conexión!");
    socket.emit("connection");
});

