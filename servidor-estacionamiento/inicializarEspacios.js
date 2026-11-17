require("dotenv").config();

const { db } = require("./firebaseAdmin");

async function inicializarEspacios() {
    try {
        let creados = 0;
        let existentes = 0;

        for (let id = 1; id <= 24; id++) {
            const referencia = db
                .collection("espacios")
                .doc(String(id));

            const resultado = await db.runTransaction(
                async (transaction) => {
                    const documento =
                        await transaction.get(referencia);

                    if (documento.exists) {
                        return false;
                    }

                    transaction.create(referencia, {
                        nivel: id <= 12 ? 1 : 2,
                        estado: "libre",
                        reservationId: null,
                    });

                    return true;
                }
            );

            if (resultado) {
                creados++;
                console.log(`Espacio ${id} creado`);
            } else {
                existentes++;
            }
        }

        console.log("\nInicialización terminada");
        console.log(`Creados: ${creados}`);
        console.log(`Ya existentes: ${existentes}`);
    } catch (error) {
        console.error("Error:", error);
        process.exitCode = 1;
    }
}

inicializarEspacios();
