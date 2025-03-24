export class Escudo {
    constructor(nombre, imagen) {
        this.nombre = nombre;
        this.imagen = `img/${imagen}`;
    }
}

export class Test {
    constructor(serie, respuestaCorrecta) {
        this.serie = serie;
        this.respuestaCorrecta = respuestaCorrecta;
    }
}

export class BDIndexedDB {
    static inicializar() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("JuegoEscudosDB", 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("tests")) {
                    db.createObjectStore("tests", { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    static async guardarTest(test) {
        const db = await BDIndexedDB.inicializar();
        const tx = db.transaction("tests", "readwrite");
        tx.objectStore("tests").add(test);
    }

    static async cargarTests() {
        const db = await BDIndexedDB.inicializar();
        const tx = db.transaction("tests", "readonly");
        const store = tx.objectStore("tests");
        return new Promise((resolve) => {
            store.getAll().onsuccess = (event) => resolve(event.target.result);
        });
    }

    static async inicializarTests() {
        const tests = await BDIndexedDB.cargarTests();
        if (tests.length === 0) {
            const escudos = [
                new Escudo("Real Madrid", "real_madrid.png"),
                new Escudo("Barcelona", "barcelona.png"),
                new Escudo("Atletico Madrid", "atletico.png"),
                new Escudo("Athletic Club", "athletic.png"),
            ];

            // const test1 = new Test([escudos[0], escudos[1], escudos[2], null], escudos[3]);
            // const test2 = new Test([escudos[1], escudos[3], escudos[0], null], escudos[2]);
            // const test3 = new Test([escudos[2], escudos[0], escudos[3], null], escudos[1]);
            const test1 = new Test([escudos[0], escudos[1], escudos[0], null], escudos[1]);
            const test2 = new Test([escudos[2], escudos[2], escudos[3], null], escudos[3]);
            const test3 = new Test([escudos[2], escudos[3], escudos[3], null], escudos[2]);

            //Math.random

            await BDIndexedDB.guardarTest(test1);
            await BDIndexedDB.guardarTest(test2);
            await BDIndexedDB.guardarTest(test3);
        }
    }
}

