/**
 * Clase DragAndDrop que gestiona la funcionalidad de arrastrar y soltar.
 * @class
 */
class DragAndDrop {
    static activar() {
        const escudos = document.querySelectorAll('.escudo');
        const casillas = document.querySelectorAll('.casilla');

        escudos.forEach(escudo => {
            escudo.draggable = true;
            escudo.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData("text", escudo.id);
            });
        });

        casillas.forEach(casilla => {
            casilla.addEventListener('dragover', (e) => e.preventDefault());

            casilla.addEventListener('drop', (e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text");
                const escudo = document.getElementById(id);
                casilla.appendChild(escudo);
            });
        });
    }
}
