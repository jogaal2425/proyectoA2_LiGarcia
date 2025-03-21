import { BDIndexedDB } from './modelo.js';
import { Storage } from './storage.js';

export class Juego {
    constructor() {
        this.tests = [];
        this.testActual = 0;
        this.tiempoInicio = null;
        this.escudosDisponibles = [
            { nombre: "Real Madrid", imagen: "img/real_madrid.png" },
            { nombre: "Barcelona", imagen: "img/barcelona.png" },
            { nombre: "Atletico Madrid", imagen: "img/atletico.png" },
            { nombre: "Athletic Club", imagen: "img/athletic.png" }
        ];
    }

    async iniciarJuego() {
        await BDIndexedDB.inicializarTests();
        this.tests = await BDIndexedDB.cargarTests();
        this.tiempoInicio = Date.now();
        this.mostrarTest();
    }

    mostrarTest() {
        const test = this.tests[this.testActual];
        if (!test) return this.finalizarJuego();

        const tablero = document.getElementById("tablero");
        const opciones = document.getElementById("opciones");

        tablero.innerHTML = "";
        opciones.innerHTML = "";

        test.serie.forEach((escudo, index) => {
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
        });

        this.escudosDisponibles.forEach(escudo => {
            const img = document.createElement("img");
            img.src = escudo.imagen;
            img.id = escudo.nombre;
            img.draggable = true;
            img.classList.add("escudo");
            img.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text", escudo.nombre);
            });
            opciones.appendChild(img);
        });
    }

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

    finalizarJuego() {
        let tiempoTotal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
        let nombre = prompt("¡Felicidades! Ingresa tu nombre:");
    
        // Regex para validar que el nombre tenga solo letras y espacios (al menos una letra)
        const regex = /^[a-zA-Z\s]+$/;
    
        if (nombre) {
            // Validar si el nombre coincide con la expresión regular
            if (regex.test(nombre)) {
                Storage.guardarPuntuacion(nombre, tiempoTotal);
                alert(`¡Guardado! ${nombre}, tu tiempo fue: ${tiempoTotal} segundos`);
                location.reload();
            } else {
                alert("Por favor, ingresa un nombre válido (solo letras y espacios).");
            }
        }
    }
    
}





