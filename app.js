document.addEventListener("DOMContentLoaded", function () {
    let timeLeft = 30; // Tiempo en segundos
    const timerDisplay = document.getElementById("time");
    const dropZone = document.getElementById("drop-zone");

    // Temporizador
    const timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            alert("¡Tiempo agotado! Inténtalo de nuevo.");
            location.reload();
        }
    }, 1000);

    // Funcionalidad Drag & Drop
    const draggables = document.querySelectorAll(".draggable");

    draggables.forEach(el => {
        el.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("id", e.target.id);
        });
    });

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("id");
        const draggedElement = document.getElementById(draggedId);
        
        // Solo permite un escudo en el hueco
        if (dropZone.children.length === 0) {
            dropZone.appendChild(draggedElement);
            checkAnswer(draggedId);
        }
    });

    // Verificar si la respuesta es correcta
    function checkAnswer(selectedId) {
        const correctAnswer = "atletico"; // Respuesta correcta para esta ronda

        if (selectedId === correctAnswer) {
            setTimeout(() => {
                alert("¡Correcto! Pasas al siguiente nivel.");
                location.reload(); // Simula el siguiente nivel
            }, 500);
        } else {
            setTimeout(() => {
                alert("Incorrecto. Inténtalo de nuevo.");
                location.reload();
            }, 500);
        }
    }
});
