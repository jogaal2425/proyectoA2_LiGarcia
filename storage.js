/**
 * Clase Storage que gestiona Web Storage.
 * @class
 */
export class Storage {
    static guardarPuntuacion(nombre, tiempo) {
        let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
        puntuaciones.push({ nombre, tiempo });
        localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
    }
}
