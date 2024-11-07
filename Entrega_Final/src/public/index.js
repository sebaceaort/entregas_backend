const socket = io();

socket.on("connection", () => {
    console.log("Nueva conexion!!!");
});

socket.on("Actualizo", () => {
    console.log("Actualizo!!!");
    location.reload();
});





