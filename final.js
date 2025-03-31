document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tiempoTotal = params.get("tiempo");
    const botonGuardar = document.getElementById("guardarPuntuacion");
    const nombreInput = document.getElementById("nombreJugador");

    document.getElementById("tiempoFinal").textContent = `Tu tiempo fue: ${tiempoTotal} segundos`;

    if (sessionStorage.getItem("noGuardar") !== "true") {
        botonGuardar.disabled = true;
    }

    nombreInput.addEventListener("input", () => {
        if (nombreInput.value.trim() !== "" && sessionStorage.getItem("noGuardar") === "true") {
            botonGuardar.disabled = false;
        } else {
            botonGuardar.disabled = true;
        }
    });

    botonGuardar.addEventListener("click", () => {
        const nombre = nombreInput.value.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (nombre && regex.test(nombre)) {
            const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
            const existe = puntuaciones.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());

            if (existe) {
                alert("Este nombre ya ha sido registrado. Juega otra partida para guardar otro nombre.");
                return;
            }

            puntuaciones.push({ nombre, tiempo: parseInt(tiempoTotal) });
            localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));

            agregarPuntuacionATabla(nombre, tiempoTotal);
            sessionStorage.setItem("noGuardar", "false");
            botonGuardar.disabled = true;
        } else {
            alert("Por favor, ingresa un nombre válido (solo letras y espacios).");
        }
    });

    mostrarTablaPuntuaciones();
});

sessionStorage.setItem("noGuardar", "true");

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

    const tiempoTotal = puntuaciones.reduce((acc, jugador) => acc + jugador.tiempo, 0);
    console.log(`Tiempo total de todos los jugadores: ${tiempoTotal} segundos`);
}

function agregarPuntuacionATabla(nombre, tiempo) {
    const tbody = document.querySelector("#tablaPuntuaciones tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${nombre}</td><td>${tiempo}</td>`;
    tbody.appendChild(tr);
}
