    import { BDIndexedDB } from './modelo.js';
    import { Storage } from './storage.js';
    import { Escudo } from './modelo.js';
    
    export class Juego {
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
    
        async iniciarJuego() {
            await BDIndexedDB.inicializarTests();
            this.tests = await BDIndexedDB.cargarTests();
            this.tiempoInicio = Date.now();
            this.mostrarTest();
            this.iniciarContador(); 
        }
    
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

        agregarEscudo(nombre, imagen) {
            this.escudosDisponibles.push(new Escudo(nombre, imagen));
        }
        obtenerSiguienteEscudo() {
            return this.escudosDisponibles.shift();
        }
    
        volverTestAnterior() {
            if (this.historialTests.length > 0) {
                this.testActual = this.historialTests.pop();
                this.mostrarTest();
            } else {
                alert("No hay tests anteriores.");
            }
        }

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
            clearInterval(this.intervaloTiempo);
        
            setTimeout(() => { 
                const tiempoTotal = Math.floor((Date.now() - this.tiempoInicio) / 1000);
                
                window.location.href = `final.html?tiempo=${tiempoTotal}`;
            }, 500);
        }
        
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
    


