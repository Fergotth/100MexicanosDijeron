// animacion inicial al empezar el juego, nombres de equipos colisionan
function startAnimation() {
    let team1 = document.getElementById('teamName1');
    let team2 = document.getElementById('teamName2');
    let itemLeft = document.getElementById('pointsTeam1');
    let itemRight = document.getElementById('pointsTeam2');
    let itemTop = document.getElementById('totalPoints');
    let itemBottom = document.getElementById('question');
    let player1 = document.getElementById('namePlayer1Team1');
    let player2 = document.getElementById('namePlayer1Team2');
    //falta elemento para el titulo de la pregunta

    // Agregar clases de animación
    team1.classList.add('zoomInLeft');
    team2.classList.add('zoomInRight');
    itemLeft.classList.add('zoomInLeft');
    itemRight.classList.add('zoomInRight');
    itemTop.classList.add('zoomInDown');
    itemBottom.classList.add('backInUp');
    player1.classList.add('backInLeft');
    player2.classList.add('backInLeft');
    

    // Remover la animación después de 3 segundos para poder reiniciar
    setTimeout(() => {
        team1.classList.remove("zoomInLeft");
        team2.classList.remove("zoomInRight");
        itemLeft.classList.remove('zoomInLeft');
        itemRight.classList.remove('zoomInRight');
        itemTop.classList.remove('zoomInDown');
        itemBottom.classList.remove('backInUp');
    }, 2000);
}

//funcion para mostrar el mensaje de ronda jugada y equipo ganador de la ronda
function roundClear(teamWinner, continuePlaying) {
    if (!continuePlaying) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="teamWinner" id="teamWinner">
            <span class="word">Ganador de Ronda
                <span class="superscript">${roundNumber}</span>
            </span>
            <span class="word">${teamWinner.textContent}</span>
            <span class="info">Presione ENTER para continuar...</span>
        </div>`);
    } else {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="teamWinner" id="teamWinner">
            <span class="word">Equipo Ganador
                <span class="superscript"></span>
            </span>
            <span class="word">${teamWinner.textContent}</span>
            <span class="info">Presione ENTER regresar a pantalla inicial...</span>
        </div>`);
    }
}

//funcion para remover el anuncio del ganador de ronda y el fondo borroso
function removeRoundClear(teamWinner, bluredBackground) {
    if (teamWinner) {
        teamWinner.parentNode.removeChild(teamWinner);
    }

    if (bluredBackground) {
        bluredBackground.parentNode.removeChild(bluredBackground);
    }
}

//funcion para colocar un fondo borroso
function bluredBackground() {
    document.body.insertAdjacentHTML('beforeend', '<div class="overlay" id="overlay"></div>');
}

//limpiar resultados mostrados en pantalla
function clearMarker() {
    for (let i = 1; i <= 5; i++) {
        let item1 = document.getElementById(`a${i}`);
        let item2 = document.getElementById(`av${i}`);
        if (!item1.classList.contains('fadeOut')) { item1.classList.add('fadeOut'); }
        if (!item2.classList.contains('fadeOut')) { item2.classList.add('fadeOut'); }
    }

    setTimeout(() => {
        for (let i = 1; i <= 5; i++) {
            let item1 = document.getElementById(`a${i}`);
            let item2 = document.getElementById(`av${i}`);
            item1.classList.remove('fadeOut');
            item1.style.display = 'none';
            item2.classList.remove('fadeOut');
            item2.style.display = 'none';   
        }
    }, 3000);
}

//funcion para cambiar el nombre del participante al siguiente en turno a responder
function switchPlayerName(idPlayer, idTeam) {
    let player = document.getElementById(`namePlayer${idPlayer}Team${idTeam}`);
    player.classList.remove('backInLeft');
    player.classList.add('backOutRight');

    if (idPlayer === 5) { idPlayer = 0; }

    player = document.getElementById(`namePlayer${idPlayer + 1}Team${idTeam}`);
    player.classList.remove('backOutRight');
    player.classList.add('backInLeft');
}

//funcion para inicializar el orden de los jugadores a jugar cuando se empieza una nueva ronda 
function initializeNextPlayer(id) {
    for (let i = 1; i <= 5; i++) {
        let player1 = document.getElementById(`namePlayer${i}Team1`);
        let player2 = document.getElementById(`namePlayer${i}Team2`);

        player1.classList.remove('backOutRight', 'backInLeft');
        player2.classList.remove('backOutRight', 'backInLeft');
    }

    let player1 = document.getElementById(`namePlayer${id}Team1`);
    let player2 = document.getElementById(`namePlayer${id}Team2`);
    player1.classList.add('backInLeft');
    player2.classList.add('backInLeft');
}

function notifications(text) {
    document.querySelectorAll('#message').forEach(element => element.remove());
    
    if (text !== null) {
        document.body.insertAdjacentHTML('beforeend', `<div class="message" id="message">${text}</div>`);
    }
}