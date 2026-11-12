
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const ArduinoSimulator = require("./simulator");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 3001);
const simulator = new ArduinoSimulator();

// Enviar actualizaciones a los teléfonos conectados
simulator.on("spaceUpdate", (space) => {
  io.emit("parking:spaceUpdate", space);
});

// Conexión desde React Native
io.on("connection", (socket) => {
  console.log("Aplicación conectada:", socket.id);

  socket.emit("parking:initialState", {
    spaces: simulator.getSpaces(),
    mode: "simulation",
  });

  socket.on("disconnect", () => {
    console.log("Aplicación desconectada:", socket.id);
  });
});

// Comprobar funcionamiento
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    mode: "simulation",
    spaces: simulator.getSpaces(),
  });
});

// Cambiar manualmente un espacio
app.post("/simulate/space/:id/:estado", (req, res) => {
  const { id, estado } = req.params;

  const success = simulator.changeSpace(id, estado);

  if (!success) {
    return res.status(400).json({
      ok: false,
      message: "Espacio o estado inválido",
    });
  }

  res.json({
    ok: true,
    space: simulator.getSpaces()[Number(id) - 1],
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("==============================");
  console.log("ESTACIONAMIENTO INTELIGENTE");
  console.log("Modo: SIMULACIÓN");
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log("==============================");

  simulator.start();
});
