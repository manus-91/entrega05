import { engine } from "express-handlebars";
import express from "express";
import { __filename, __dirname } from "./utils.js";
import viewsRoutes from "./routes/views.router.js";
import viewsRealTime from "./routes/realTimeProduct.router.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { guardarProducto } from "./services/productUtils.js";

const app = express();
const httpServer = createServer(app);

const PORT = 8081;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", viewsRoutes);
app.use("/realtime", viewsRealTime);

httpServer.listen(PORT, () => {
console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
console.log("Nuevo cliente conectado");

socket.on("mensaje", (data) => {
console.log("Mensaje recibido:", data);

socket.emit("respuesta", "Mensaje recibido correctamente");
});

socket.on("agregarProducto", (newProduct) => {
console.log("Nuevo producto recibido backend:", newProduct);
guardarProducto(newProduct);
io.emit("nuevoProductoAgregado", newProduct);
});

socket.on("disconnect", () => {
console.log("Cliente desconectado");
});
});