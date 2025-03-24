/**
 * Clase Storage que gestiona Web Storage.
 * @class
 * Autores: Joan Garcia y un maricon
 */
export class Storage {
    static guardarPuntuacion(nombre, tiempo) {
        let puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
        puntuaciones.push({ nombre, tiempo });
        localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
    }

    static obtenerPuntuaciones() {
        return JSON.parse(localStorage.getItem("puntuaciones")) || [];
    }
}
