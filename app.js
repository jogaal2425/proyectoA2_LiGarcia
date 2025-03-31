import { Juego } from './juego.js';

/**
 * Espera a que el DOM se haya cargado completamente para iniciar el juego.
 */
document.addEventListener("DOMContentLoaded", () => {
    const juego = new Juego();
    juego.iniciarJuego();
});
