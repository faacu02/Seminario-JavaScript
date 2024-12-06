let playerData = {};

let option1 = document.getElementById("option1");
let option2 = document.getElementById("option2");
let option3 = document.getElementById("option3");

let makeQuestionButton = document.getElementById("question-button");
let sendAnswerButton = document.getElementById("submit-answer");

let dado = document.getElementById("dice-button");
dado.disabled = true;

const answers = document.querySelectorAll(".buttons-options");

let answerSelected = "";

const jsonData = localStorage.getItem("playerData");
playerData = JSON.parse(jsonData);

const boardID = playerData.idBoard;

const textID = document.getElementById("idBoard");
textID.textContent = "ID Tablero: " + boardID;

const player = {
  color: playerData.colorPlayer,
  nombre: playerData.namePlayer,
  posicion: playerData.pos,
};

const opponent = {
  color:"",
  nombre:""
}

let pregunta = {
  pregunta: "",
  opcion1: "",
  opcion2: "",
  opcion3: "",
  dado: 0,
  jugador: " ",
};
/////////////////////////////////////////////////////////////////////////////////////////////
/////////Funciones sin Fetchs directos
function checkTurn() {
  verifyEnd();
  verifyTurn();
  buscarTablero();
}

function sentAnswer() {
  dado.disabled = true;

  enviarRespuesta();

  cambiarTurno();

  document.getElementById("submit-answer").disabled = true;

  makeQuestionButton.disabled = true;

  clearQuestion();
  
  checkTurn();
}

function configButtonsStart(){
  sendAnswerButton.disabled = true;
  makeQuestionButton.disabled = true;
}

function graficarArray(array) {
  if (array[0] === "0")
    array[0] = "Salida"

  const container = document.getElementById("array-container");
  container.innerHTML = "";

  const list = document.createElement("ul");

  array.forEach((element) => {
    const item = document.createElement("li");

    if (element.includes(player.nombre) || element.includes(opponent.nombre)){
        if (element.includes(player.nombre)){
            let player1 = document.createElement("p")
            player1.textContent = player.nombre
            player1.style.color = player.color
            item.appendChild(player1)
        }
        if (element.includes(opponent.nombre)){
            let player2 = document.createElement("p")
            player2.textContent = opponent.nombre
            player2.style.color = opponent.color
            item.appendChild(player2)
        }
    }else{
        let posicion = document.createElement("p")
        posicion.textContent = element
        item.appendChild(posicion)
    }
    list.appendChild(item);
  });
  container.appendChild(list);
}

function selectAnswer(answer) {
   
  option1.classList.remove('choseone');
  option2.classList.remove('choseone');
  option3.classList.remove('choseone');

  if(sendAnswerButton.disabled == true){
    sendAnswerButton.disabled = false
  }
  answer.classList.add('choseone');
  answerSelected = answer.value
}

function optionChosen(answers){
  answers.forEach(function(button) {
   button.classList.remove('chosenone');
  });
  answers.classList.add('choseone');

  answerSelected = answers.value;
}

function clearQuestion() {

  option1.classList.remove('choseone');
  option2.classList.remove('choseone');
  option3.classList.remove('choseone');

  option1.textContent="";
  option2.textContent="";
  option3.textContent="";

  option1.disabled = true;
  option2.disabled = true;
  option3.disabled = true;

  document.getElementById("question").innerHTML = "";

  setTimeout(function() {
    document.getElementById("showResult").textContent = "";
  }, 3000);

  sendAnswerButton.disabled = true;

  dado.textContent = "Dado";

  pregunta.pregunta = "";
  pregunta.dado = 0;
}

// funciones con fetchs directos

function waitPlayers(){

  function showWaitingPlayers(){
    document.getElementById("waitingPlayers").textContent = "Esperando al segundo jugador ...";
}
  fetchWaitPlayers().then((data) => {
  
  opponent.color = data.colorOpponent
  opponent.nombre = data.nameOpponent


  if (!data.complete) {
    showWaitingPlayers()
    setTimeout(waitPlayers, 5000);
  } else {
    document.getElementById("waitingPlayers").textContent = "";
    buscarTablero()
    checkTurn()
  }
  configButtonsStart();
}
)}


function verifyEnd() {

  function showEndGame(){window.location.href = "endGame.html"}

  fetchVerifyEnd().then((data) => { 
  
  if (data.end){
    const jsonData = JSON.stringify(data.winnerName,data.winnerColor);
    localStorage.setItem("dataWinner", jsonData);
    setTimeout(showEndGame, 5000);
  }
}
)}

function verifyTurn(){
  fetchVerifyTurn().then((data) => { 

  document.getElementById("turno-text").innerHTML = "Turno: " + data.nombre;
  if (!data.turn){
    document.getElementById("guide").textContent = "Esperando tu turno..."

    setTimeout(checkTurn, 5000);
    
  }
  else{
    dado.disabled = false
    document.getElementById("guide").textContent = "Tira el Dado!"

  }
}
)}

function tirarDado(){
  fetchTirarDado().then((data) => { 
  
  var numeroDado = String(data);
  dado.textContent = numeroDado;
  pregunta.dado= data
  dado.disabled = true;
  makeQuestionButton.disabled = false;

  document.getElementById("guide").textContent = "Ya puedes obtener tu pregunta!"

}
)}

function makeQuestion(){
  fetchMakeQuestion().then((data) => { 
  
  option1.disabled = false;
  option2.disabled = false;
  option3.disabled = false;
  document.getElementById("question-button").disabled = true
  
  pregunta.pregunta = data.question;
  
  document.getElementById("question").innerHTML = pregunta.pregunta;
  
  option1.textContent = data.answers[0].str;
  option2.textContent = data.answers[1].str;
  option3.textContent = data.answers[2].str;
  
  document.getElementById("question-button").disabled = true;

  document.getElementById("guide").textContent = "Elige con cuidado"

}
)}

function enviarRespuesta(){
  fetchEnviarRespuesta().then((data) => { 
  if (data.bienomal) {
    document.getElementById("showResult").textContent =
    "Respuesta correcta";
  } else {
    document.getElementById("showResult").textContent =
    "Respuesta incorrecta";
  }
  graficarArray(data.tablero)
}
)}

function cambiarTurno(){
  fetchCambiarTurno().then((data) => {}
)}

function verifificarFin(){
  fetchVerificarFin().then((data) => { 
      
  if (data.end) {
    const jsonData = JSON.stringify(data.winnerName, data.winnerColor);
    localStorage.setItem("dataWinner", jsonData);
    window.location.href = "endGame.html"
  }
}
)}

function buscarTablero(){
    fetchBuscarTablero().then((data) => { 
  
  graficarArray(data)
}
)}

//////////////////////////////////////////////////////////////// FETCHS


function fetchWaitPlayers() {
  return fetch("http://localhost:3000/boardComplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idBoard: playerData.idBoard, idPlayer: playerData.idPlayer}),
  })
    .then((response) => response.json())
}

function fetchVerifyEnd (){
  return fetch("http://localhost:3000/verifyEnd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idBoard: playerData.idBoard}),
  })
.then((response) => response.json())
}

function fetchVerifyTurn() {
  return fetch("http://localhost:3000/verifyTurn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({idBoard: playerData.idBoard, idPlayer: playerData.idPlayer}),
      })
    .then((response) => response.json())
}

function fetchTirarDado (){
return fetch("http://localhost:3000/quiz/board/dice")
  .then((response) => response.json())
} 

function fetchMakeQuestion() {
  return fetch("http://localhost:3000/quiz/board/answer")
    .then((response) => response.json())
}

function fetchEnviarRespuesta(){

  let answerQuestion = {
    question: pregunta.pregunta,
    answerSelected: answerSelected,
  };

  return fetch("http://localhost:3000/enviarRespuesta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({answer: answerQuestion, boardId: boardID, dice: pregunta.dado, idPlayer: playerData.idPlayer}),
  })
    .then((response) => response.json())
}

function fetchCambiarTurno(){
  return fetch("http://localhost:3000/cambiarTurno", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idBoard: playerData.idBoard, idPlayer: playerData.idPlayer}),
  })
.then((response) => response.json())
}

function fetchVerificarFin(player) {
  return fetch("http://localhost:3000/verifyEnd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idBoard: playerData.idBoard }),
  })
    .then((response) => response.json())
}

function fetchBuscarTablero(){
  return fetch("http://localhost:3000/newBoard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idBoard: playerData.idBoard}),
  })
    .then((response) => response.json())
}

waitPlayers();
