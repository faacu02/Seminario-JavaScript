const successSpan = document.getElementById("success-msg");
const errorSpan = document.getElementById("error-msg");
const colorButtons = document.querySelectorAll(".color-button");
const nameInput = document.getElementById("name");
const submitButton = document.getElementById("submitInfo");
const joinGameButton = document.getElementById("joinId");
const createGameButton = document.getElementById("start-button");
let selectedColor = "";
submitButton.disabled = true;

function unlock() {
  submitButton.disabled = true;
  colorButtons.forEach(function(button) {
    button.disabled = true;
  });


  nameInput.disabled = true;

  joinGameButton.disabled = false;

  createGameButton.disabled = false;

  const name = nameInput.value;

  const formData = {
    name: name,
    color: selectedColor,
  };

  try {
    const jsonData = JSON.stringify(formData);
    localStorage.setItem("formData", jsonData);

  } catch (error) {
    successSpan.textContent = "";
    errorSpan.textContent = "Ocurrió un error al guardar los datos.";
  }
}



function createGame() {
  const playerFormData = JSON.parse(localStorage.getItem("formData"));
  fetch("http://localhost:3000/nuevoJuego", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerInfo: playerFormData }),
  })
    .then((response) => response.json())
    .then((data) => {
      const jsonData = JSON.stringify(data);

      localStorage.setItem("playerData", jsonData);

      redirectNewGame();
    });
}


function joinGame() {
  const playerInfo = JSON.parse(localStorage.getItem("formData"));

  const board = document.getElementById("idBoard").value;

  const playerInfoJoin = {
    color: playerInfo.color,
    name: playerInfo.name,
    idBoard: board,
  };

  fetch("http://localhost:3000/joinGame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerInfo: playerInfoJoin }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data!==null){
      if(data.valido){
      const jsonData = JSON.stringify(data.player);
      localStorage.setItem("playerData", jsonData);
      redirectNewGame()
      }
      else{
        alert('Color en uso, escoge otro')
        colorButtons.forEach(function(button) {
          button.disabled = false;
      })
      submitButton.disabled = false;
      }
    }
    else{
      alert('El id de la sala no existe o ya esta la sala completa, por favor ingrese uno válido')
    }
    });
  }
  
function redirectNewGame() {
  window.location.href = "inGame.html";
}

///////////////////////////////////////////////////////////////////// STYLE
var colorSelect = document.getElementById("color");

function selectColor(color) {
  colorButtons.forEach(function(button) {
    button.classList.remove('active');
  });
  if (nameInput.value != "")
    submitButton.disabled = false;
  else
    alert("No ingreso un nombre")
  color.classList.add('active');
  selectedColor = color.value
}
