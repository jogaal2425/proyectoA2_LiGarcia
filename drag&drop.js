/**
 * Clase para gestionar el almacenamiento de puntuaciones en LocalStorage.
 */
export class Storage {
    /**
     * Guarda una nueva puntuación en el almacenamiento local.
     * @param {string} nombre - Nombre del jugador.
     * @param {number} tiempo - Tiempo registrado en segundos.
     */
    static guardarPuntuacion(nombre, tiempo) {
        let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
        puntuaciones.push({ nombre, tiempo });
        localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
    }
}
