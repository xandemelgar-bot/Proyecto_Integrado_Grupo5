
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const rutaClave = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!rutaClave) {
    throw new Error(
        'No se encontró la ruta de la clave privada de Firebase.'
    );
}

const cuentaServicio = require(rutaClave);

initializeApp({
    credential: cert(cuentaServicio),
});

const db = getFirestore();


async function crearEspacios() {
    let creados = 0;
    let existentes = 0;

    for (let nivel = 1; nivel <= 2; nivel++) {
        const letra = nivel === 1 ? 'A' : 'B';

        for (let numero = 1; numero <= 12; numero++) {
            const id = `${letra}${String(numero).padStart(2, '0')}`;

            const referencia = db.collection('espacios').doc(id);

            try {
                await referencia.create({
                    id,
                    nivel,
                    numero,
                    estado: 'libre',
                    reservaId: null,
                    reservadoPor: null,
                    fechaFinReserva: null,
                });

                console.log(`Creado: ${id}`);
                creados++;
            } catch (error) {
                if (error.code === 6 || error.code === 'already-exists') {
                    console.log(`Ya existe: ${id}`);
                    existentes++;
                } else {
                    throw error;
                }
            }
        }
    }

    console.log(
        `Finalizado: ${creados} creados, ${existentes} existentes.`
    );
}

crearEspacios()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error al crear espacios:', error);
        process.exit(1);
    });
