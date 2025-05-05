/**
 * Clase base para representar un escudo de equipo.
 */
class EscudoBase {
    /**
     * @param {string} nombre - Nombre del equipo.
     * @param {string} imagen - Nombre del archivo de imagen (se asume que está en "img/").
     */
    constructor(nombre, imagen) {
        this.nombre = nombre;
        this.imagen = `img/${imagen}`;
    }

    /**
     * Devuelve un string representando el escudo.
     * @returns {string} - Información del escudo.
     */
    mostrarEscudo() {
        return `Escudo: ${this.nombre}`;
    }
}

/**
 * Clase que representa un escudo específico, heredando de EscudoBase.
 */
export class Escudo extends EscudoBase {
    /**
     * @param {string} nombre - Nombre del equipo.
     * @param {string} imagen - Nombre del archivo de imagen.
     */
    constructor(nombre, imagen) {
        super(nombre, imagen);
    }
}

/**
 * Representa un test del juego, con una serie de escudos y la respuesta correcta.
 */
export class Test {
    /**
     * @param {Escudo[]} serie - Serie de escudos del test.
     * @param {Escudo} respuestaCorrecta - Escudo que es la respuesta correcta.
     */
    constructor(serie, respuestaCorrecta) {
        this.serie = serie;
        this.respuestaCorrecta = respuestaCorrecta;
    }
}

/**
 * Clase para manejar la base de datos IndexedDB donde se almacenan los tests.
 */
export class BDIndexedDB {
    /**
     * Inicializa la base de datos IndexedDB y crea el object store si no existe.
     * @returns {Promise<IDBDatabase>} - Promesa que resuelve con la base de datos abierta.
     */
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

    /**
     * Guarda un test en la base de datos IndexedDB.
     * @param {Test} test - Objeto Test a guardar.
     */
    static async guardarTest(test) {
        const db = await BDIndexedDB.inicializar();
        const tx = db.transaction("tests", "readwrite");
        tx.objectStore("tests").add(test);
    }

    /**
     * Carga todos los tests almacenados en la base de datos.
     * @returns {Promise<Test[]>} - Promesa que resuelve con un array de tests.
     */
    static async cargarTests() {
        const db = await BDIndexedDB.inicializar();
        const tx = db.transaction("tests", "readonly");
        const store = tx.objectStore("tests");
        return new Promise((resolve) => {
            store.getAll().onsuccess = (event) => resolve(event.target.result);
        });
    }

    /**
     * Inicializa los tests en la base de datos si aún no existen.
     * Crea una serie de tests con escudos predefinidos.
     */
    static async inicializarTests() {
        const tests = await BDIndexedDB.cargarTests();
        if (tests.length === 0) {
            const escudos = [
                new Escudo("Real Madrid", "real_madrid.png"),
                new Escudo("Barcelona", "barcelona.png"),
                new Escudo("Atletico Madrid", "atletico.png"),
                new Escudo("Athletic Club", "athletic.png"),
            ];

            const test1 = new Test([escudos[0], escudos[1], escudos[0], null], escudos[1]);
            const test2 = new Test([escudos[2], escudos[2], escudos[3], null], escudos[3]);
            const test3 = new Test([escudos[2], escudos[3], escudos[3], null], escudos[2]);
            const test4 = new Test([escudos[0], escudos[1], escudos[1], null], escudos[1]);

            await BDIndexedDB.guardarTest(test1);
            await BDIndexedDB.guardarTest(test2);
            await BDIndexedDB.guardarTest(test3);
            await BDIndexedDB.guardarTest(test4);
        }
    }
}
