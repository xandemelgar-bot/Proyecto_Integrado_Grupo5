
const EventEmitter = require("events");

class ArduinoSimulator extends EventEmitter {
  constructor() {
    super();

    this.spaces = Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      nivel: i < 12 ? 1 : 2,
      estado: "libre",
    }));

    this.timer = null;
  }

  start() {
    console.log("Simulador de Arduino iniciado");

    this.timer = setInterval(() => {
      const id = Math.floor(Math.random() * 24) + 1;
      const espacio = this.spaces[id - 1];

      espacio.estado =
        espacio.estado === "libre" ? "ocupado" : "libre";

      this.emit("spaceUpdate", { ...espacio });

      console.log(
        `Arduino simulado: espacio ${id} -> ${espacio.estado}`
      );
    }, 8000);
  }

  changeSpace(id, estado) {
    const numero = Number(id);

    if (
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > 24 ||
      !["libre", "ocupado"].includes(estado)
    ) {
      return false;
    }

    const espacio = this.spaces[numero - 1];
    espacio.estado = estado;

    this.emit("spaceUpdate", { ...espacio });

    return true;
  }

  getSpaces() {
    return this.spaces.map((space) => ({ ...space }));
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }
}

module.exports = ArduinoSimulator;
