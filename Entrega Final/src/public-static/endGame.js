const winner = document.getElementById("playerName")

const playerData = JSON.parse(localStorage.getItem("playerData"))


function createConfeti() {
    const confeti = document.createElement('div');
    confeti.classList.add('confeti');
    confeti.style.backgroundColor = getRandomColor(); // Agregar el color aleatorio
    confeti.style.left = `${Math.random() * 100}%`;
    confeti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confeti.style.animationDelay = `${Math.random() * 2}s`;
    return confeti;
  }

  
  function getRandomColor() {
    // Generar un color hexadecimal aleatorio
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  function animateConfeti() {
    const confetiContainer = document.getElementById('confeti-container');
    for (let i = 0; i < 50; i++) {
      const confeti = createConfeti();
      confetiContainer.appendChild(confeti);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos del ganador desde el Local Storage
    fetch("http://localhost:3000/infoWinner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idBoard: playerData.idBoard})})
    .then((response) => response.json())
    .then((data) => {
      // Actualizar el contenido y el estilo del elemento h1
      winner.textContent = data.name;
      winner.style.color = data.color;
      animateConfeti();
    })  
  })



