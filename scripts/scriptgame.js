let count = 0;
var roundNumber = 0;
var isProcesing = false;
var isSelectingTeam = true;
var isSelectingStarterTeam = true;
var isResponding = true;
var isWaiting = false;
var chanceSteal = false;
var isPlaying = false;
var isSelectingQuestion = false;
let actualTeam;
var actualPlayerId = 1;
let answersLogger = {
    timesAnswered: 0,
    incorrectAnswer: 0,
    correctAnswers: 0,
    points: 0,
    actualAnswerPts: 0,
    lastAnswersPts: 0,
    pointsToWin: 0,
    continuePlaying: false
};

let answersData = {
    id: "",
    question: "",
    answers: [
        {answer: "", points: 0},
        {answer: "", points: 0},
        {answer: "", points: 0},
        {answer: "", points: 0},
        {answer: "", points: 0}
    ]
};

const sounds = {
    intro: new Audio('/sounds/audio1.wav'),
    start: new Audio('/sounds/audio2.wav'),
    correct: new Audio('/sounds/audio3.wav'),
    win: new Audio('/sounds/audio4.wav'),
    wrong: new Audio('/sounds/audio5.wav'),
    timeOver: new Audio('/sounds/audio6.wav'),
    points: new Audio('/sounds/audio7.wav'),
    invalid: new Audio('/sounds/audio8.wav')
};

document.querySelector('.form').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita que la página se recargue
});

document.addEventListener("DOMContentLoaded", () => {
    const searchQuestion = document.querySelector(".form-submit-btn");
    const buttonBack = document.getElementById('returnHome');
    searchQuestion.addEventListener("click", selectQuestion);
    buttonBack.addEventListener('click', () => {
        window.location.replace('index.html');
    });

});

window.onload = function () {
    playSound(sounds.intro);
    const modalQuestion = document.getElementById('newModal');
    modalQuestion.classList.add('visible');
};

async function selectQuestion() {
    // funcion para seleccionar con que pregunta iniciar a jugar, esto debe de reemplazar a changeBackground()
    const idToSearch = document.getElementById('idQuestion').value;    
    if (idToSearch) {
        let found = await extractDataAnswersById(idToSearch);
        if (!found) {
            //no existe el id buscado
            playSound(sounds.invalid);
        } else {
            document.getElementById('newModal').classList.remove('visible');
            isSelectingQuestion = false;

            if (roundNumber === 0) {
                changeBackground();
            } else {
                clearMarker();
                upgradePoints(document.getElementById('totalPoints'), Number(document.getElementById('totalPoints').innerText), 0, true);
            }
        }
    }
}

function changeBackground() {
    const background = document.getElementById('background');
    const originalBackground = 'img-iniciar.jpg';
    const currentBackground = getComputedStyle(background).backgroundImage;

    if (!sounds.intro.paused) {
        sounds.intro.pause();
        sounds.intro.currentTime = 0;
    }

    if (currentBackground.includes(originalBackground)) {
        background.style.backgroundImage = 'url("/images/img-tablero.jpg")';

        const items = background.querySelectorAll('*');
        items.forEach(item => {
            if (item.className.includes('item--top') || item.className.includes('item--left') || item.className.includes('item--right') || item.className.includes('item--namePlayerTeam1')|| item.className.includes('item--namePlayerTeam2')) { 
                item.style.display = 'flex';
            }

            if (item.className.includes('item--bottom') || item.className.includes('item--teamName1') || item.className.includes('item--teamName2')) {
                item.style.display = 'flex';
            }
        })

        extractDataTeam();
        startAnimation();
    }
};

function keyHandler(event) {
    const afterBkg = document.getElementById('background').style.backgroundImage === 'url("/images/img-tablero.jpg")';

    if (document.getElementById('newModal').classList.contains('visible')) {
        return;
    }

    if (event.code === "Space" && !isWaiting && afterBkg && !isSelectingTeam && !isProcesing) {
        isWaiting = true;
        startTimer(sounds.timeOver);
        return;
    }

    if (event.key === "Enter") {
        if (!answersLogger.continuePlaying) {
            if (isSelectingQuestion) {
                removeRoundClear(document.getElementById('teamWinner'), document.getElementById('overlay'));
                const modalQuestion = document.getElementById('newModal');
                modalQuestion.classList.add('visible');
                isSelectingQuestion = false;
            }
        } else {
            window.location.replace('index.html');
        }

        return;
    }
    
    if (event.key >= '1' && event.key <= '5' && afterBkg) {
        if (isSelectingTeam) {
            selectingTeam(event.key);
        } else {
            if (!isProcesing) {
                if (isWaiting) {
                    if (correctAnswer(event.key)) {
                        answersLogger.timesAnswered++;
                        if (isResponding) {
                            bestAnswer(event.key);
                        } else {
                            // se inicia el juego hasta los 3 errores o ganar la ronda
                            
                            // 3 respuestas erroneas e inicia el intento de robo de puntos
                            if (chanceSteal) {
                                answersLogger.correctAnswers = 5;
                            }
                        }
                        
                        if (respondingTeam(answersLogger.correctAnswers)) {
                            resetKeys();
                        }
                    }
                }
            }
        }
    } else {
        if ((event.key === 'x' || event.key === 'X') && afterBkg && !isProcesing) {
            if (isWaiting) {
                evaluateWrongAnswer();
            }
        }
    }
}

//evalua cuando la respuesta es incorrecta
function evaluateWrongAnswer(timeOver = true) {
    if (isResponding) { answersLogger.timesAnswered++; }

    if (!isSelectingTeam && isResponding) {
        typeWrongAnswer(false, timeOver);
        bestAnswer();                    
    } else {
        if (!chanceSteal) {
            typeWrongAnswer(true, timeOver);
        } else {
            if (answersData.incorrectAnswer !== 3) {
                typeWrongAnswer(false, timeOver);
            }
        }
        
        //valida si hay oportunidad de robo de puntos
        if (chanceSteal) {
            if (respondingTeam(5)) {
                switchAnimation(switchIDTeam());
                resetKeys();
            }
        }
        
        if (answersLogger.incorrectAnswer === 3 && !chanceSteal) {
            switchAnimation(switchIDTeam());
            chanceSteal = true;
        }
    }
}

//evalua si la respuesta incorrecta es al momento de estar jugando o que equipo empezara a jugar
function typeWrongAnswer(playing = true, timeOver = true) {
    const itemsImg = document.querySelectorAll('.item--img');
    answersLogger.incorrectAnswer++;

    if (isWaiting && timeOver) {
        onTimesUp(null);
    }

    if (playing) {
        switchPlayerName(actualPlayerId, actualTeam.className.match(/\d+/));
        if (++actualPlayerId > 5) { actualPlayerId = 1; }

        if (count >= (itemsImg.length - 1)) {
            count = 0;
        }

        isProcesing = true;

        for (let i = 0; i <= count; i++) {
            if (itemsImg[i]) {
                itemsImg[i].style.display = 'block';
            }
                
            setTimeout(() => {
                itemsImg[i]?.classList.add('visible');
            }, 10);
        }

        setTimeout(() => {
            for (let i = 0; i <= count; i++) {
                if (itemsImg[i]) {
                    itemsImg[i].classList.remove('visible');
                    itemsImg[i].classList.add('hidden');
                }

                setTimeout(() => {
                    if (itemsImg[i]) {
                        itemsImg[i].style.display = 'none';
                        itemsImg[i].classList.remove('hidden');
                    }

                    if (i === count) {
                        isProcesing = false;
                    }
                }, 750);
            }
        }, 750);

        count++;
        
    } else {
        isProcesing = true;
        itemsImg[3].style.display = 'block';
        
        setTimeout(() => {
            itemsImg[3].classList.add('visible');
        }, 10);

        setTimeout(() => {                
            itemsImg[3].classList.remove('visible');
            itemsImg[3].classList.add('hidden');
                
        setTimeout(() => {
            itemsImg[3].style.display = 'none';
            itemsImg[3].classList.remove('hidden');    

            isProcesing = false;
            }, 750);
        }, 750);

        switchAnimation(switchIDTeam());
    }
    
    playSound(sounds.wrong);
}

//mostrar respuesta que si existe en el tablero
function showAnswer(key) {
    const answer = document.getElementById(`a${key}`);
    const value = document.getElementById(`av${key}`);
    const points = document.getElementById('totalPoints');

    answer.textContent = answersData.answers[key - 1].answer;
    value.textContent = answersData.answers[key - 1].points;

    playSound(sounds.correct);
    answer.style.display = 'block';

    answersLogger.lastAnswersPts = answersLogger.actualAnswerPts;
    answersLogger.actualAnswerPts = Number(answersData.answers[key - 1].points);

    setTimeout(() => {
        playSound(sounds.points);
        value.style.display = 'block';
        upgradePoints(points, Number(points.textContent), Number(answersData.answers[key - 1].points));
    }, 1000);

    answersLogger.points += Number(answersData.answers[key - 1].points);
}

// funcion para actualizar el marcador total
async function upgradePoints(MarkerPoints, currentPoints, increment, reset = false) {
    let targetPoints = Number(currentPoints) + Number(increment);
    isProcesing = true;

    if (!reset) {
        for (let i = currentPoints; i <= targetPoints; i++) {
            MarkerPoints.textContent = i;
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    } else {
        for (i = targetPoints; i >= 0; i--) {
            MarkerPoints.textContent = i;
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    }

    if (isPlaying) {
        switchPlayerName(actualPlayerId, actualTeam.className.match(/\d+/));
        if (++actualPlayerId > 5) { actualPlayerId = 1; }
    }

    isProcesing = false;
}

// seleccionar el equipo que iniciara mediante la primer pregunta con mayor puntos
function selectingTeam(key) {
    if ((key === "1" || key === "2")) {
        actualTeam = document.querySelector(`.team${key}--name`);
        actualTeam.classList.add('shadowAnimation');
        isSelectingTeam = false;
    } else  {
        playSound(sounds.invalid);
    }
}

//funcion donde se empieza a jugar hasta que un equipo gane la ronda
function bestAnswer(key) {
    // Caso 1: El participante actual da la respuesta número 1
    if (key === "1") {
        startTheGame();
        return;
    }

    // Caso 2: Primer participante responde correctamente la primera vez en selectingTeam
    if (answersLogger.timesAnswered === 1) {
        if (answersLogger.correctAnswers === 1) {
            switchAnimation(switchIDTeam());
        }
        return;
    }
//debugger
    // Caso 2.1: Segundo participante responde correctamente y se evaluara la mejor respuesta para decidir que equipo inicia a jugar
    if (answersLogger.timesAnswered === 2) {
        if (answersLogger.correctAnswers === 2) {
            if (answersLogger.lastAnswersPts > answersLogger.actualAnswerPts) {
                switchAnimation(switchIDTeam());
            } else {
                answersLogger.actualAnswerPts += answersLogger.actualAnswerPts;
            }

            startTheGame();
            return;
        }

        // Caso 2.2: Primer jugador respondio incorrecto y segundo correcto lo que inicia el juego con el equipo con la respuesta correcta
        if (answersLogger.incorrectAnswer === 1 && answersLogger.correctAnswers === 1) {
            startTheGame();
            return;
        }
    }

    // Caso 3: Primer y segundo participantes incorrectos, inicia el primer jugador que responde correctamente
    if (answersLogger.incorrectAnswer >= 1 && answersLogger.correctAnswers === 1) {
        startTheGame();
    }
}

//funcion para iniciar el juego con el equipo inicial que contesto mejor que el otro
function startTheGame() {
    isPlaying = true;
    isResponding = false;
    isSelectingTeam = false;
    answersLogger.incorrectAnswer = 0;
}

function correctAnswer(key) {
    const answer = document.getElementById(`a${key}`);
    const isVisible = getComputedStyle(answer).display === 'block';

    if (!isVisible && !isSelectingTeam) {
        if (isWaiting) {
            onTimesUp(null);
        }
        
        answersLogger.correctAnswers++;
        showAnswer(key);
        isWaiting = false;
        return true;
    }

    playSound(sounds.invalid);    
    return false;
}

// funcion para reproducir el sonido
function playSound(sound) {
    if (!sound.paused) {
        sound.pause();  // Detiene el sonido actual
        sound.currentTime = 0;  // Reinicia el tiempo de reproducción
    }

    if (sounds.timeOver.paused) { sound.play(); }
}

// funcion para intercabiar el id del equipo actual al contrario
function switchIDTeam() {
    let id = actualTeam.className.match(/\d+/);
                
    if (id[0] === '1') {
        id[0] = '2';
    } else {
        id[0] = '1';
    }

    return id[0];
}

// cambia la animacion de equipo seleccionado
function switchAnimation(key) {
    actualTeam.classList.remove('shadowAnimation');
    actualTeam = document.querySelector(`.team${key}--name`);
    actualTeam.classList.add('shadowAnimation');
}

// funcion para determinar cuando el equipo responde las 5 preguntas o se equivoca 3 veces para iniciar trato de robo de puntos del otro equipo
function respondingTeam(correctAnswers)  {
    if (correctAnswers === 5) {
        let id = actualTeam.className.match(/\d+/);
        const pointsEarned = document.getElementById(`pointsTeam${id}`);
        let totalPoints = Number(pointsEarned.textContent) + Number(answersLogger.points);
        upgradePoints(pointsEarned, Number(pointsEarned.textContent), Number(answersLogger.points));
        playSound(sounds.win);
        roundNumber++;
        isSelectingQuestion = true;
        
        //aqui llamaremos la funcion para mostrar el equipo ganador y evaluar si algun equipo ya gano
        setTimeout(() => {
            bluredBackground();
            if (totalPoints  < answersLogger.pointsToWin) {
                roundClear(actualTeam, answersLogger.continuePlaying);    
            } else {
                //aqui se utilizara si ya gano el equipo con los puntos necesarios
                answersLogger.continuePlaying = true;
                roundClear(actualTeam, answersLogger.continuePlaying);
            }
        }, 3000);
        return true;
    }
    return false;
}

// funcion para cuando se presente el robo de puntos
function chanceStealPoints(wrongAnswer) {
    if (wrongAnswer === 3) {
        switchAnimation(switchIDTeam());
        chanceSteal = true;
    }
}

// funcion para reiniciar los valores iniciales a 0
function resetKeys() {
    count = 0;
    Object.assign(answersLogger, {
        timesAnswered: 0,
        incorrectAnswer: 0,
        correctAnswers: 0,
        points: 0,
        actualAnswerPts: 0,
        lastAnswersPts: 0
    });

    isProcesing = false;
    isSelectingTeam = true;
    isSelectingStarterTeam = true;
    isResponding = true;
    isWaiting = false;
    chanceSteal = false;
    isPlaying = false;
    actualPlayerId = ((roundNumber + 1 - 1) % 5) + 1;
    actualTeam.classList.remove('shadowAnimation');
    initializeNextPlayer(actualPlayerId);
}

document.addEventListener('keydown', keyHandler);

//funcion para extraer los nombres de los equipos e integrantes
function extractDataTeam() {
    fetch('/data/teams.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al cargar el archivo: ${response.statusText}`);
                }
                return response.json()
            })

            .then(jsonData => {
                document.getElementById('teamName1').textContent = jsonData['team1'].nameTeam1;
                document.getElementById('teamName2').textContent = jsonData['team2'].nameTeam2;
                answersLogger.pointsToWin = jsonData.points;

                for (let i = 1; i <= 5; i++) {
                    document.getElementById(`namePlayer${i}Team1`).textContent = jsonData.team1.playersTeam1[`player${i}`];
                    document.getElementById(`namePlayer${i}Team2`).textContent = jsonData.team2.playersTeam2[`player${i}`];
                }
            })

            .catch(error => {
                console.error('Error al cargar el archivo:', error)
            });
}

async function extractDataAnswersById(targetId) {
    try {
        const response = await fetch('/data/answers.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText}`);
        }

        const jsonData = await response.json();

        // Busca el objeto con el id especificado
        const questionData = jsonData.find(item => String(item.id) === String(targetId));

        if (questionData) {
            // Muestra la pregunta en el elemento con id 'question'
            answersData.question = questionData.Question;
            document.getElementById('question').textContent = answersData.question;

            // Recorre las respuestas del objeto encontrado
            for (let i = 0; i <= 4; i++) {
                if (questionData[`Respuesta${i + 1}`]) {  // Evita errores si faltan respuestas
                    answersData.answers[i].answer = questionData[`Respuesta${i + 1}`].answer || "";
                    answersData.answers[i].points = questionData[`Respuesta${i + 1}`].points || 0;
                }
            }

            return true;
        } else {
            console.log(`No se encontró una pregunta con el id: ${targetId}`);
            return false;
        }
    } catch (error) {
        console.error('Error al cargar el archivo:', error);
        return false;
    }
}