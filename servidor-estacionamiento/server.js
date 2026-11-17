
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const ArduinoSimulator = require("./simulator");
const { db } = require("./firebaseAdmin");
const { FieldValue } = require("firebase-admin/firestore");
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

// La escritura en Firebase debe activarse
// explícitamente para las pruebas.
const SYNC_FIREBASE =
    process.env.SYNC_FIREBASE === "true";

const simulator = new ArduinoSimulator();

// =========================================
// GUARDAR LECTURA EN FIREBASE
// =========================================

async function guardarLectura(space) {
    const id = Number(space.id);

    if (
        !Number.isInteger(id) ||
        id < 1 ||
        id > 24 ||
        !["libre", "ocupado"].includes(space.estado)
    ) {
        return;
    }

    await db
        .collection("lecturasSensores")
        .doc(String(id))
        .set({
            nivel: id <= 12 ? 1 : 2,
            ocupacionFisica: space.estado,
            origen: "simulador",
            ultimaLectura: FieldValue.serverTimestamp(),
        }, { merge: true });

    console.log(
        `Firebase: espacio ${id} -> ${space.estado}`
    );
}

// =========================================
// EVENTOS DEL SIMULADOR
// =========================================

simulator.on("spaceUpdate", (space) => {
    io.emit("parking:spaceUpdate", space);

    if (SYNC_FIREBASE) {
        guardarLectura(space).catch((error) => {
            console.error(
                "Error al guardar lectura:",
                error.message
            );
        });
    }
});

// =========================================
// CONEXIÓN SOCKET.IO
// =========================================

io.on("connection", (socket) => {
    console.log(
        "Aplicación conectada:",
        socket.id
    );

    socket.emit("parking:initialState", {
        spaces: simulator.getSpaces(),
        mode: "simulation",
    });

    socket.on("disconnect", () => {
        console.log(
            "Aplicación desconectada:",
            socket.id
        );
    });
});

// =========================================
// ESTADO DEL SERVIDOR
// =========================================

app.get("/health", (req, res) => {
    res.json({
        ok: true,
        mode: "simulation",
        firebaseSync: SYNC_FIREBASE,
        spaces: simulator.getSpaces(),
    });
});

// =========================================
// CAMBIAR ESPACIO MANUALMENTE
// =========================================

app.post(
    "/simulate/space/:id/:estado",
    (req, res) => {
        const { id, estado } = req.params;

        const success = simulator.changeSpace(
            id,
            estado
        );

        if (!success) {
            return res.status(400).json({
                ok: false,
                message:
                    "Espacio o estado inválido",
            });
        }

        res.json({
            ok: true,
            space:
                simulator.getSpaces()[
                Number(id) - 1
                ],
        });
    }
);

// =========================================
// INICIAR SERVIDOR
// =========================================

server.listen(PORT, "0.0.0.0", () => {
    console.log("==============================");
    console.log("ESTACIONAMIENTO INTELIGENTE");
    console.log("Modo: SIMULACIÓN");
    console.log(
        `Servidor: http://localhost:${PORT}`
    );
    console.log(
        "Firebase Sync:",
        SYNC_FIREBASE ? "ACTIVADO" : "DESACTIVADO"
    );
    console.log("==============================");

    if (process.env.AUTO_SIMULATION === "true") {
        simulator.start();
        console.log("Simulación automática activada");
    } else {
        console.log("Simulación automática desactivada");
    }
});
