document.addEventListener("DOMContentLoaded", () => {
    // Obtener el tiempo desde la URL
    const params = new URLSearchParams(window.location.search);
    const tiempoTotal = params.get("tiempo");

    // Mostrar el tiempo en la página
    document.getElementById("tiempoFinal").textContent = `Tu tiempo fue: ${tiempoTotal} segundos`;

    document.getElementById("guardarPuntuacion").addEventListener("click", () => {
        const nombre = document.getElementById("nombreJugador").value.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (nombre && regex.test(nombre)) {
            const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
            puntuaciones.push({ nombre, tiempo: parseInt(tiempoTotal) });
            localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));

            agregarPuntuacionATabla(nombre, tiempoTotal);
        } else {
            alert("Por favor, ingresa un nombre válido (solo letras y espacios).");
        }
    });

    mostrarTablaPuntuaciones();
});

function mostrarTablaPuntuaciones() {
    const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
    const tbody = document.querySelector("#tablaPuntuaciones tbody");

    tbody.innerHTML = ""; // Limpiar tabla antes de agregar nuevas filas

    puntuaciones.forEach(({ nombre, tiempo }) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${nombre}</td><td>${tiempo}</td>`;
        tbody.appendChild(tr);
    });
}

function agregarPuntuacionATabla(nombre, tiempo) {
    const tbody = document.querySelector("#tablaPuntuaciones tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${nombre}</td><td>${tiempo}</td>`;
    tbody.appendChild(tr);
}
