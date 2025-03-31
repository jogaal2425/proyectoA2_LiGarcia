/**
 * Script para gestionar la pantalla de resultados del juego.
 * Se encarga de mostrar el tiempo final, permitir el guardado de puntuaciones y actualizar la tabla de mejores tiempos.
 */
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tiempoTotal = params.get("tiempo");
    const botonGuardar = document.getElementById("guardarPuntuacion");
    const nombreInput = document.getElementById("nombreJugador");

    // Muestra el tiempo final del jugador en la interfaz.
    document.getElementById("tiempoFinal").textContent = `Tu tiempo fue: ${tiempoTotal} segundos`;

    // Si la sesión ya ha guardado una puntuación, se deshabilita el botón de guardado.
    if (sessionStorage.getItem("noGuardar") !== "true") {
        botonGuardar.disabled = true;
    }

    /**
     * Habilita o deshabilita el botón de guardar puntuación en función del input del jugador.
     */
    nombreInput.addEventListener("input", () => {
        if (nombreInput.value.trim() !== "" && sessionStorage.getItem("noGuardar") === "true") {
            botonGuardar.disabled = false;
        } else {
            botonGuardar.disabled = true;
        }
    });

    /**
     * Guarda la puntuación en localStorage si el nombre es válido y no está repetido.
     */
    botonGuardar.addEventListener("click", () => {
        const nombre = nombreInput.value.trim();
        const regex = /^[a-zA-Z\s]+$/; // Permite solo letras y espacios.

        if (nombre && regex.test(nombre)) {
            const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
            const existe = puntuaciones.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());

            if (existe) {
                alert("Este nombre ya ha sido registrado. Juega otra partida para guardar otro nombre.");
                return;
            }

            // Guarda la puntuación y la actualiza en localStorage.
            puntuaciones.push({ nombre, tiempo: parseInt(tiempoTotal) });
            localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));

            agregarPuntuacionATabla(nombre, tiempoTotal);
            sessionStorage.setItem("noGuardar", "false");
            botonGuardar.disabled = true;
        } else {
            alert("Por favor, ingresa un nombre válido (solo letras y espacios).");
        }
    });

    // Muestra la tabla de puntuaciones al cargar la página.
    mostrarTablaPuntuaciones();
});

// Evita que un mismo jugador guarde varias veces en la misma sesión.
sessionStorage.setItem("noGuardar", "true");

/**
 * Muestra la tabla de puntuaciones en la interfaz, ordenando por mejor tiempo.
 */
function mostrarTablaPuntuaciones() {
    const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
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

    // Calcula el tiempo total de todos los jugadores como dato extra.
    const tiempoTotal = puntuaciones.reduce((acc, jugador) => acc + jugador.tiempo, 0);
    console.log(`Tiempo total de todos los jugadores: ${tiempoTotal} segundos`);
}

/**
 * Agrega una nueva puntuación a la tabla sin recargar la página.
 * @param {string} nombre - Nombre del jugador.
 * @param {number} tiempo - Tiempo registrado en segundos.
 */
function agregarPuntuacionATabla(nombre, tiempo) {
    const tbody = document.querySelector("#tablaPuntuaciones tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${nombre}</td><td>${tiempo}</td>`;
    tbody.appendChild(tr);
}
