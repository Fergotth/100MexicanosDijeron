function startGame() {
    Promise.all([
        fetch('/data/teams.json').then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo: ${response.statusText}`);
            }
            return response.json();
        }),
        fetch('/data/answers.json').then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo: ${response.statusText}`);
            }
            return response.json();
        })
    ])
    .then(([teamsData, answersData]) => {
        window.location.href = "indexgame.html";
    })
    .catch(error => {
        console.error("Error en la carga de los archivos JSON", error);
        alert("Falta registrar algun equipo o no existe ninguna pregunta registrada");
    });
}

function quitGame() {
    if (confirm("¿Desea cerrar el juego?")) {
        window.close();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const playerButton = document.getElementById("playerButton");
    const questionsButton = document.getElementById("questionsButton");
    const modifyQuestionButton = document.getElementById('modifyQuestionsButton');
    const quitButton = document.getElementById("quitButton");
    const instructions = document.getElementById('instructions');

    startButton.addEventListener("click", startGame);
    playerButton.addEventListener("click", startCapturePlayers);
    questionsButton.addEventListener("click", startCaptureQuestions);
    modifyQuestionButton.addEventListener('click', modifyQuestions);
    instructions.addEventListener('click', showInstructions);
    quitButton.addEventListener("click", quitGame);
});

function startCapturePlayers() {
    // Mostrar modal
    const modalJugadores = document.getElementById('modalJugadores');
    const closeModal = document.getElementById('closeModal');
    const saveData = document.getElementById('saveData');
    const cleanInputsPlayers = modalJugadores.querySelectorAll("input");

    // Limpia los input si es que ya tenian un valor registrado
    cleanInputsPlayers.forEach(input => input.value = "");
    modalJugadores.style.display = 'block';

    const saveDataButton = saveData.cloneNode(true);
    saveData.parentNode.replaceChild(saveDataButton, saveData);
    
    // Guardar datos
    saveDataButton.addEventListener('click', () => {
        const teams = {
            team1: {
                nameTeam1: document.getElementById('team1Name').value,
                playersTeam1: {
                player1: document.getElementById('namePlayer1Team1').value,
                player2: document.getElementById('namePlayer2Team1').value,
                player3: document.getElementById('namePlayer3Team1').value,
                player4: document.getElementById('namePlayer4Team1').value,
                player5: document.getElementById('namePlayer5Team1').value
                }
            },
            team2: {
                nameTeam2: document.getElementById('team2Name').value,
                playersTeam2: {
                player1: document.getElementById('namePlayer1Team2').value,
                player2: document.getElementById('namePlayer2Team2').value,
                player3: document.getElementById('namePlayer3Team2').value,
                player4: document.getElementById('namePlayer4Team2').value,
                player5: document.getElementById('namePlayer5Team2').value
                }
            },
            points: document.getElementById('totalPoints').value
        };

        // Enviar datos al servidor para sobrescribir teams.json
        fetch('http://127.0.0.1:5500/save-teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teams)
        })
        .then(response => {
            if (response.ok) {
                console.log('Datos guardados correctamente en el servidor');
                modalJugadores.style.display = 'none';
            } else {
            console.error('Error al guardar los datos en el servidor');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
        });

        modalJugadores.style.display = 'none';
    }, { once: true });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modalJugadores.style.display = 'none';
    });
}

function startCaptureQuestions() {
    const modalQuestions = document.getElementById('modalQuestionsForm');
    const closeModalQuestions = document.getElementById('closeModalQuestions');
    const saveDataQuestions = document.getElementById('saveDataButtonQuestion');
    const clearInputsQuestion = modalQuestions.querySelectorAll('input');

    clearInputsQuestion.forEach(input => input.value = "");

    modalQuestions.style.display = 'block';

    const newSaveDataButton = saveDataQuestions.cloneNode(true);
    saveDataQuestions.parentNode.replaceChild(newSaveDataButton, saveDataQuestions);

    newSaveDataButton.addEventListener('click', () => {
        const answers = { 
            "Question": document.getElementById('inputQuestion').value, 
            "id": document.getElementById('inputId').value 
        };
    
        for (let i = 1; i <= 5; i++) {
            const answer = document.getElementById(`inputAnswer${i}`)?.value;
            const pointsAnswer = document.getElementById(`inputValueAnswer${i}`)?.value;
    
            if (answer) {
                answers[`Respuesta${i}`] = { answer, points: pointsAnswer || "0" };
            }
        }
    
        // Enviar datos al servidor mediante fetch
        fetch('http://127.0.0.1:5500/save-answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        }).then(response => {
            if (response.ok) {
                console.log('Datos guardados correctamente');
                modalQuestions.style.display = 'none';
            } else {
                console.error('Error al guardar los datos');
            }
        });
    });   

    closeModalQuestions.addEventListener('click', () => {
        modalQuestions.style.display = 'none';
    });
}

function modifyQuestions() {
    const nextIdToShow = document.querySelector('.iconR');
    const backIdToShow = document.querySelector('.iconL');
    const idToSearch = document.getElementById('inputModifyId');
    const search = document.querySelector('.iconS');

    search.onclick = () => { 
        alert('Prueba'); }    
    nextIdToShow.onclick = () => { 
        extractData(Number(idToSearch.value) + 1); }
    backIdToShow.onclick = () => { 
        extractData(Number(idToSearch.value) - 1); }

    const modalQuestions = document.getElementById('modalModifyQuestionsForm');
    const closeModalQuestions = document.getElementById('closeModalModifyQuestions');
    const saveDataQuestions = document.getElementById('saveDataButtonModifyQuestion');

    modalQuestions.style.display = 'block';

    let extractData = async (id) => {
        try {
            const response = await fetch('/data/answers.json');
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo: ${response.statusText}`);
            }
    
            const jsonData = await response.json();
    
            // Busca el objeto con el id especificado
            const data = jsonData.find(item => String(item.id) === String(id));
    
            if (data) {
                // Muestra la pregunta en el elemento con id 'question'
                document.getElementById('inputModifyQuestion').value = data.Question;
                document.getElementById('inputModifyId').value = data.id;
    
                // Recorre las respuestas del objeto encontrado
                for (let i = 1; i <= 5; i++) {
                    if (data[`Respuesta${i}`]) {  // Evita errores si faltan respuestas
                        document.getElementById(`inputModifyAnswer${i}`).value = data[`Respuesta${i}`].answer || "";
                        document.getElementById(`inputModifyValueAnswer${i}`).value = data[`Respuesta${i}`].points || 0;
                    }
                }    
            } else {
                console.log(`No se encontró una pregunta con el id: ${id}`);
            }
        } catch (error) {
            console.error('Error al cargar el archivo:', error);
        }
    }

    extractData(1);

    saveDataQuestions.onclick = () => {
        const id = document.getElementById('inputModifyId').value;
        if (!id) {
            console.error('Error: El ID es obligatorio');
            return;
        }
    
        const answers = { 
            "Question": document.getElementById('inputModifyQuestion').value 
        };
    
        for (let i = 1; i <= 5; i++) {
            const answer = document.getElementById(`inputModifyAnswer${i}`)?.value;
            const pointsAnswer = document.getElementById(`inputModifyValueAnswer${i}`)?.value;
    
            if (answer) {
                answers[`Respuesta${i}`] = { answer, points: pointsAnswer || "0" };
            }
        }
    
        // Enviar datos al servidor mediante fetch
        fetch(`http://127.0.0.1:5500/update-answer/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        }).then(response => {
            if (response.ok) {
                console.log('Datos guardados correctamente');
            } else {
                console.error('Error al guardar los datos');
            }
        }).catch(error => {
            console.error('Error en la petición:', error);
        });
    }       

    closeModalQuestions.addEventListener('click', () => {
        modalQuestions.style.display = 'none';
    });
}

function showInstructions() {
    window.location.href = "demo.html";
}