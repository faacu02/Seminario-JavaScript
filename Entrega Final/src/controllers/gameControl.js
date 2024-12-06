import fs from "fs";
import q_a from "../data/questions.json" assert { type: "json" };
import matches from "../data/matches.json" assert { type: "json" };
import { json, request } from "express";
import { match } from "assert";
import { v4 as uuidv4 } from "uuid";
import { Console } from "console";
const rutaJson = "src/data/matches.json";

function verifyEnd(req,res){
  let idBoard = req.body.idBoard;
  let partida = buscarPartida(idBoard)

  if (partida.winner != null){
    res.json({end:true, winnerName: partida.winner.nombre, winnerColor:partida.winner.color})
  }
  else{
    res.json({end:false, winnerName:null,winnerColor:null})
  }
}

function boardComplete(req,res){
    let partida = buscarPartida(req.body.idBoard)
    if (partida.jugadores[1].idPlayer == null){
      res.json({complete:false})
    }
    else
      if (req.body.idPlayer === partida.jugadores[0].idPlayer)
        res.json({complete:true, colorOpponent: partida.jugadores[1].color,nameOpponent:partida.jugadores[1].name})
      else
        res.json({complete:true, colorOpponent: partida.jugadores[0].color,nameOpponent:partida.jugadores[0].name})
}

function validateAnswers(req, res) {
  let partida = buscarPartida(req.body.boardId);
  let question = q_a.filter((q) => q.pregunta == req.body.answer.question);
  let tableroActualizado = partida.tablero; // Crear una copia del tablero actual
  let isCorrect = false;
  if ((question[0].correcta == req.body.answer.answerSelected) && (req.body.dice >= 1 && req.body.dice <= 6)) {
    isCorrect = true;
    if (partida.jugadores[0].idPlayer == req.body.idPlayer){
      if (partida.jugadores[0].pos + req.body.dice <=20)
         actualizarTablero(partida,tableroActualizado,req.body.dice,req.body.idPlayer) // Actualizar el tablero con los nuevos valores
      else{
        terminarPartida(partida,req.body.idPlayer)
      }
        
    }
    else{
      if (partida.jugadores[1].pos + req.body.dice<= 20)
        actualizarTablero(partida,tableroActualizado,req.body.dice,req.body.idPlayer)
      else{
        terminarPartida(partida,req.body.idPlayer)
      }
    }
  }
  res.json({ bienomal: isCorrect, tablero: tableroActualizado });
}

function terminarPartida(partida,idWinner){
  if (partida.jugadores[0].idPlayer === idWinner){
    if (partida.tablero[partida.jugadores[0].pos].includes(partida.jugadores[1].name))
      partida.tablero[partida.jugadores[0].pos]=partida.jugadores[1].name
    else
      partida.tablero[partida.jugadores[0].pos] = (partida.jugadores[0].pos.toString())
    partida.winner = partida.jugadores[0]
    partida.tablero[21] = partida.jugadores[0].name
  }
  else{
    if (partida.tablero[partida.jugadores[1].pos].includes(partida.jugadores[0].name))
      partida.tablero[partida.jugadores[1].pos]=partida.jugadores[0].name
    else
      partida.tablero[partida.jugadores[1].pos] = (partida.jugadores[1].pos.toString())
   partida.winner = partida.jugadores[1]
   partida.tablero[21] = partida.jugadores[1].name
  }
  partida.turno = -1;

  actualizarJSON(partida);
}

function actualizarTablero(partida, tablero, dice, idPlayer) {

  if (partida.jugadores[0].idPlayer == idPlayer) {
    if (partida.tablero[partida.jugadores[0].pos].includes(partida.jugadores[1].name)) {
      tablero[partida.jugadores[0].pos] = partida.jugadores[1].name;
    }
    else
      tablero[partida.jugadores[0].pos]= (partida.jugadores[0].pos).toString()
    partida.jugadores[0].pos += dice;
    if (partida.tablero[partida.jugadores[0].pos].includes(partida.jugadores[1].name))
     tablero[partida.jugadores[0].pos] += ", "  + partida.jugadores[0].name;
    else
      tablero[partida.jugadores[0].pos] = partida.jugadores[0].name
  } else {
    if (partida.tablero[partida.jugadores[1].pos].includes(partida.jugadores[0].name)) {
      tablero[partida.jugadores[1].pos] = partida.jugadores[0].name;
    }
    else
      tablero[partida.jugadores[1].pos]= (partida.jugadores[1].pos).toString()
    partida.jugadores[1].pos += dice;
    if (partida.tablero[partida.jugadores[1].pos].includes(partida.jugadores[0].name))
       tablero[partida.jugadores[1].pos] += ", " + partida.jugadores[1].name
    else  
      tablero[partida.jugadores[1].pos] = partida.jugadores[1].name
  }
  actualizarJSON(partida);
}

function actualizarJSON(partida) {
  let foundIndex = matches.findIndex((match) => match.idBoard === partida.idBoard);
  if (foundIndex !== -1) {
    matches[foundIndex] = partida;
    fs.writeFileSync(rutaJson, JSON.stringify(matches), "utf8");
  }
}

function getAnswer(req, res) {
  var randomNumber = Math.floor(Math.random() * q_a.length);

  let response = {
    question: q_a[randomNumber].pregunta,
    answers: q_a[randomNumber].respuestas,
  };

  res.json(response);
}

function dice(req, res) {
  var randomNumber = Math.floor(Math.random() * 6) + 1;
  res.json(randomNumber);
}

function saveGame(json) {
  matches.push(json);
  fs.writeFileSync(rutaJson, JSON.stringify(matches), "utf8");
}

function generateId() {
  return uuidv4();
}

function newIdBoard() {
  return uuidv4();
}

function createGame(req, res) {
  let idPlayer = generateId();
  let idBoard = newIdBoard();
  let color = req.body.playerInfo.color;
  let name = req.body.playerInfo.name + " (P1)";
  

  let player = {
    idPlayer: idPlayer,
    idBoard: idBoard,
    colorPlayer: color,
    namePlayer: name,
    pos: 0,
  };

  const gameData = {
    idBoard: idBoard,

    jugadores: [
      {
        name:name,
        idPlayer: idPlayer,
        color: color,
        pos: 0,
      },
      {
        idPlayer: null,
        name: null,
        color: null,
        pos: 0,
      },
    ],
    tablero: [
      "Salida "+ player.namePlayer+" " ,"1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","LLegada",
    ],

    turno: idPlayer, //comienza el jugador 1

    winner: null,
  };

  saveGame(gameData);

  res.json(player);
}

function joinGame(req, res) {
  let idPlayer = generateId();
  let idBoard = req.body.playerInfo.idBoard;
  let color = req.body.playerInfo.color;
  let name = req.body.playerInfo.name+" (P2)"
  let partida= buscarPartida(req.body.playerInfo.idBoard)
  if((partida)&&(partida.jugadores[1].idPlayer==null)){
  if (partida.jugadores[0].color!== color){
  let player = {
    idPlayer: idPlayer,
    idBoard: idBoard,
    colorPlayer: color,
    namePlayer: name ,
    pos: 0,
  };

  findGame(player);
  res.json({player: player, valido: true});
}
else
  res.json(false)
}
else
  res.json(null)
}


function buscarTablero(id) {
  let foundMatch = matches.find((match) => match.idBoard == id);
  if (foundMatch != null) {
    
    return foundMatch.tablero;
  }
}

function buscarPartida(id) {
  let foundMatch = matches.find((match) => match.idBoard === id);
  if (foundMatch !== null) {
    return foundMatch;
  }
  return null;
}

function devolverBoard(req, res) {
  let tablero = buscarTablero(req.body.idBoard);
  res.json(tablero);
}

function cambiarTurno(req, res){
  const jsonPartida= buscarPartida(req.body.idBoard)
  if (jsonPartida.jugadores[0].idPlayer=== req.body.idPlayer)
    jsonPartida.turno= jsonPartida.jugadores[1].idPlayer
  else
  jsonPartida.turno= jsonPartida.jugadores[0].idPlayer
  actualizarJSON(jsonPartida)
  res.json({seGuardo: "se cambio el turno"})
}
function findGame(newPlayer) {
  const partida = buscarPartida(newPlayer.idBoard);
  
    partida.jugadores[1].idPlayer = newPlayer.idPlayer;
    partida.jugadores[1].color = newPlayer.colorPlayer;
    partida.jugadores[1].name = newPlayer.namePlayer;
    partida.tablero[0] += newPlayer.namePlayer;

  actualizarJSON(partida);
}

function verifyTurn(req, res){
  const data = req.body
  const jsonPartida= buscarPartida(data.idBoard)
  let nombreTurno = ""
  if (jsonPartida.jugadores[0].idPlayer === jsonPartida.turno)
     nombreTurno = jsonPartida.jugadores[0].name
  else{
    nombreTurno = jsonPartida.jugadores[1].name
  }
  if (data.idPlayer == jsonPartida.turno)
    res.json({turn: true, nombre: nombreTurno})
  else  
    res.json({turn: false, nombre : nombreTurno})
}

function devolverWinner(req,res){
   const partida = buscarPartida(req.body.idBoard)
   const winner = partida.winner
   res.json(winner)
}



export default {
  cambiarTurno,
  dice,
  getAnswer,
  validateAnswers,
  saveGame,
  findGame,
  createGame,
  joinGame,
  devolverBoard,
  verifyTurn,
  verifyEnd,
  boardComplete,
  devolverWinner
};
