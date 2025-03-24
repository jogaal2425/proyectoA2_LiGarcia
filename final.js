document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const tiempoTotal = params.get("tiempo");

    document.getElementById("tiempoFinal").textContent = `Tu tiempo fue: ${tiempoTotal} segundos`;

    document.getElementById("guardarPuntuacion").addEventListener("click", () => {
        const nombre = document.getElementById("nombreJugador").value.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (nombre && regex.test(nombre)) {
            const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];

            const existe = puntuaciones.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
            if (existe) {
                alert("Este nombre ya ha sido registrado. Usa otro.");
                return;
            }

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

    tbody.innerHTML = "";

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
