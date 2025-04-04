import { BDIndexedDB } from './modelo.js';
import { Storage } from './storage.js';
import { Escudo } from './modelo.js';

/**
 * Clase que gestiona el juego de patrones con escudos.
 */
export class Juego {
    /**
     * Constructor de la clase Juego.
     * Inicializa los valores del juego, incluyendo los tests, historial, tiempo y escudos disponibles.
     */
    constructor() {
        this.tests = [];
        this.testActual = 0;
        this.historialTests = [];
        this.escudosDisponibles = [];
        this.tiempoInicio = null;
        this.tiempoRestante = 30;
        this.intervaloTiempo = null;
        this.puntuacionesMap = new Map();
        this.nombresSet = new Set();
        this.escudosDisponibles = [
            { nombre: "Real Madrid", imagen: "img/real_madrid.png" },
            { nombre: "Barcelona", imagen: "img/barcelona.png" },
            { nombre: "Atletico Madrid", imagen: "img/atletico.png" },
            { nombre: "Athletic Club", imagen: "img/athletic.png" }
        ];
    }

    /**
     * Inicia el juego cargando los tests desde IndexedDB y comenzando el contador de tiempo.
     */
    async iniciarJuego() {
        await BDIndexedDB.inicializarTests();
        this.tests = await BDIndexedDB.cargarTests();
        this.tiempoInicio = Date.now();
        this.mostrarTest();
        this.iniciarContador(); 
    }

    /**
     * Inicia el contador regresivo del tiempo de juego.
     * Muestra el tiempo restante en el DOM y finaliza el juego cuando llega a 0.
     */
    iniciarContador() {
        const contadorElemento = document.getElementById("time");

        this.intervaloTiempo = setInterval(() => {
            this.tiempoRestante--;
            contadorElemento.textContent = this.tiempoRestante;

            if (this.tiempoRestante <= 0) {
                clearInterval(this.intervaloTiempo);
                alert("¡Tiempo agotado!");
                location.reload();
            }
        }, 1000);
    }

    /**
     * Agrega un nuevo escudo a la lista de escudos disponibles.
     * @param {string} nombre - Nombre del escudo.
     * @param {string} imagen - Ruta de la imagen del escudo.
     */
    agregarEscudo(nombre, imagen) {
        this.escudosDisponibles.push(new Escudo(nombre, imagen));
    }

    /**
     * Obtiene el siguiente escudo disponible en la lista.
     * @returns {Object|null} El siguiente escudo o null si no hay más.
     */
    obtenerSiguienteEscudo() {
        return this.escudosDisponibles.shift();
    }

    /**
     * Vuelve al test anterior si hay historial disponible.
     */
    volverTestAnterior() {
        if (this.historialTests.length > 0) {
            this.testActual = this.historialTests.pop();
            this.mostrarTest();
        } else {
            alert("No hay tests anteriores.");
        }
    }

    /**
     * Muestra el test actual en el tablero.
     * Carga los escudos en la interfaz y gestiona el arrastre para la validación de respuestas.
     */
    mostrarTest() {
        if (this.testActual > 0) {
            this.historialTests.push(this.testActual - 1);
        }

        const test = this.tests[this.testActual];
        if (!test) return this.finalizarJuego();

        const tablero = document.getElementById("tablero");
        const opciones = document.getElementById("opciones");

        tablero.innerHTML = "";
        opciones.innerHTML = "";

        for (const indice in test.serie) {
            const escudo = test.serie[indice];
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");

            if (escudo) {
                const img = document.createElement("img");
                img.src = escudo.imagen;
                img.classList.add("escudo");
                casilla.appendChild(img);
            } else {
                casilla.dataset.correcto = test.respuestaCorrecta.nombre;
                casilla.addEventListener("drop", this.validarRespuesta.bind(this));
                casilla.addEventListener("dragover", (e) => e.preventDefault());
            }

            tablero.appendChild(casilla);
        };

        for (const escudo of this.escudosDisponibles) {
            const img = document.createElement("img");
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");
            img.src = escudo.imagen;
            img.id = escudo.nombre;
            img.draggable = true;
            img.classList.add("escudo");
            img.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text", escudo.nombre);
            });
            opciones.appendChild(casilla);
            casilla.appendChild(img);
        }
    }

    /**
     * Valida si la respuesta del usuario es correcta.
     * Si es correcta, avanza al siguiente test.
     * @param {DragEvent} e - Evento de arrastre y soltar.
     */
    validarRespuesta(e) {
        e.preventDefault();
        const escudoId = e.dataTransfer.getData("text");
        const escudo = document.getElementById(escudoId);
        const casilla = e.target;

        if (escudo && casilla.dataset.correcto === escudoId) {
            casilla.appendChild(escudo);
            setTimeout(() => {
                this.testActual++;
                this.mostrarTest();
            }, 1000);
        } else {
            alert("¡Incorrecto! Inténtalo de nuevo.");
        }
    }

    /**
     * Finaliza el juego, detiene el contador y redirige a la pantalla final con el tiempo total.
     */
    finalizarJuego() {
        clearInterval(this.intervaloTiempo);
    
        setTimeout(() => { 
            const tiempoTotal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
            window.location.href = `final.html?tiempo=${tiempoTotal}`;
        }, 500);
    }

    /**
     * Muestra la tabla de puntuaciones en la interfaz ordenando los mejores tiempos.
     */
    mostrarTablaPuntuaciones() {
        const puntuaciones = Storage.obtenerPuntuaciones();
        const tbody = document.querySelector("#tablaPuntuaciones tbody");
        tbody.innerHTML = "";

        puntuaciones
            .sort((a, b) => a.tiempo - b.tiempo)
            .slice(0, 5)
            .forEach(({ nombre, tiempo }) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${nombre}</td><td>${tiempo}</td>`;
                tbody.appendChild(tr);
            });
    }

    /**
     * Agrega una nueva puntuación si el nombre no ha sido registrado antes.
     * Guarda la puntuación en el almacenamiento local y actualiza la tabla de puntuaciones.
     * @param {string} nombre - Nombre del jugador.
     * @param {number} tiempo - Tiempo registrado en segundos.
     */
    agregarPuntuacion(nombre, tiempo) {
        if (this.nombresSet.has(nombre)) {
            alert("Este nombre ya ha sido registrado.");
            return;
        }
        this.nombresSet.add(nombre);
        this.puntuacionesMap.set(nombre, tiempo);

        Storage.guardarPuntuacion(nombre, tiempo);
        this.mostrarTablaPuntuaciones();
    }
}
