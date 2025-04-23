const clickEvent = document.querySelector('.backgroundBlured');
const messageOnScreen = document.querySelector('.message');
const button = document.getElementById('returnHome');
let element = document.querySelector('.item--question');
let timesClicked = 1;
let timer;
let isWaiting = false;

// clickImg.onclick = () => {
//     clickImg.append(clickImg.querySelector(':first-child'));
// };

button.onclick = () => {
    window.location.replace('index.html');
}

clickEvent.onclick = () => {
    explication(timesClicked);
    restartTimer();
};

function restartTimer() {
    clearTimeout(timer);
    timer = setTimeout(() => explication(timesClicked), 6000);
}

function explication(index) {
    timesClicked++;
    restartTimer();

    switch(index) {
        case 1:
            clickEvent.classList.add('overlay');
            messageOnScreen.classList.remove('pulse');
            messageOnScreen.style.display = 'none';
            element = document.querySelector('.item--question');
            element.classList.add('pulse');
            element.style.zIndex = 110;
            message("Esta es la pregunta con la que se esta jugando esta ronda", 50, 80);
            break;
        case 2:
            element = document.querySelector('.item--question');
            element.style.zIndex = 100;
            element.classList.remove('pulse');
            element = document.querySelectorAll('[class*="Points"]'); //crea una nodeList de los elementos que tengan en su nombre la palabra "Points"
            element.forEach(item => {
                item.classList.add('pulse');
                item.style.zIndex = 110;
            });
            message("Aqui se muestran los puntos de cada equipo y los puntos de la ronda actual", 50, 50);
            break;
        case 3:
            message("Puntos del equipo 1", 22, 41);
            break;
        case 4:
            message("Puntos del equipo 2", 76, 41);
            break;
        case 5:
            message("Puntos acumulados de la ronda actual", 52, 27);
            break;
        case 6:
            element = document.querySelectorAll('[class*="Points"]');
            element.forEach(item => {
                item.classList.remove('pulse');
                item.style.zIndex = 100;
            });
            element = document.querySelector('.item--team1');
            element.classList.add('pulse');
            element.style.zIndex = 110;
            message("Nombre el equipo 1", 27, 17);
            break;
        case 7:
            element = document.querySelector('.item--team1');
            element.classList.remove('pulse');
            element = document.querySelector('.item--team2');
            element.classList.add('pulse');
            element.style.zIndex = 110;
            message("Nombre el equipo 2", 74, 17);
            break;
        case 8:
            element = document.querySelectorAll('[class*="item--team"]');
            element.forEach(item => {
                item.classList.remove('pulse');
                item.style.zIndex = 100;
            })
            element = document.getElementById('namePlayer1Team1');
            element.classList.add('pulse');
            element.style.zIndex = 110;
            element = document.getElementById('namePlayer1Team2');
            element.classList.add('pulse');
            element.style.zIndex = 110;
            message("Jugador que esta respondiendo", 52, 20);
            break;
        case 9:
            element = document.getElementById('namePlayer1Team1');
            element.classList.remove('pulse');
            element.style.zIndex = 100;
            element = document.getElementById('namePlayer1Team2');
            element.classList.remove('pulse');
            element.style.zIndex = 100;
            clickEvent.classList.remove('overlay');
            message("Primero seleccionamos que equipo inicia a responder", 50, 30);
            break;
        case 10:
            message("Deberas presionar la tecla 1 para seleccionar el 'Equipo 1' o la tecla 2 para el 'Equipo 2'",50 , 30);
            break;
        case 11:
            message("Una vez presionada el numero del equipo que iniciara, el nombre del equipo se seleccionara", 50, 30);
            element = document.querySelector('.item--team1');
            element.classList.add('pulse');
            break;
        case 12:
            message("Ahora deberas presionar la 'Barra espaciadora' para inicar el reloj de la cuenta regresiva para responder", 50, 30);
            break;
        case 13:
            message("Las respuestas estan numerados del 1 al 5, deberas presionar en el teclado el numero de la respuesta", 50, 30);
            break;
        case 14:
            message("Se mostrara en el tablero la respuesta seleccionada", 50, 30);
            element = document.getElementById('a4Value');
            element.style.display = 'block';
            element.style.zIndex = 110;
            element = document.getElementById('av4Value');
            element.style.display = 'block';
            element.style.zIndex = 110;
            document.getElementById('totalPoints').textContent = element.textContent;
            break;
        case 15:
            message("Al ser la fase de seleccion si no se da la respuesta numero 1, el equipo contrincante tiene derecho a responder para intentar dar una mejor respuesta", 50, 30);
            break;
        case 16:
            message("Si responde erroneamente se mostrara en pantalla una X e iniciara el equipo que si respondio correctamente", 50, 30);
            element = document.getElementById('img');
            element.style.display = 'block';
            element.zIndex = 110;
            element.style.top = `40%`;
            element.style.left = `43%`;
            break;
        case 17:
            message("En caso de responder correctamente, el equipo que tuvo la respuesta mayor iniciara a jugar la ronda", 50, 30);
            element = document.getElementById('img');
            element.style.display = 'none';
            element = document.getElementById('a5Value');
            element.style.display = 'block';
            element.style.zIndex = 110;
            element = document.getElementById('av5Value');
            element.style.display = 'block';
            element.style.zIndex = 110;
            document.getElementById('totalPoints').textContent = "28";
            break;
        case 18:
            message("El equipo tiene que responder las preguntas y ganar, en caso de tener 3 errores, iniciara la fase de robo de puntos donde si el equipo contrincante responde correctamente automaticamente gana la ronda", 50, 45);
            element = document.querySelector('.item--team1');
            element.classList.remove('pulse');
            element = document.querySelector('.item--team2');
            element.classList.add('pulse');
            break;
        case 19:
            message("Una vez terminada la ronda, con algun equipo ganador se reinicia el tablero y se tiene que seleccionar el ID de la siguiente pregunta para jugar hasta juntar los puntos totales para ganar el juego", 50, 45);
            break;
        case 20:
            message("Ahora si, !!! a JUGAR !!!", 50, 45);
            break;  
    }
}

function message(text, left, top) {
    if (getComputedStyle(messageOnScreen).display === 'none') { 
        messageOnScreen.style.display = 'block';
    }
    messageOnScreen.textContent = text;
    messageOnScreen.style.zIndex = 120;
    messageOnScreen.style.left = `${left}%`;
    messageOnScreen.style.top = `${top}%`;
}