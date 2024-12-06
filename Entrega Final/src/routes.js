import express from 'express';

import gameControl from './controllers/gameControl.js';
 


const routerServer = express.Router();

// Ruta homepage
routerServer.post('/verifyTurn', gameControl.verifyTurn)
routerServer.post('/cambiarTurno', gameControl.cambiarTurno)
routerServer.get('/quiz/board/dice', gameControl.dice)
routerServer.get('/quiz/board/answer', gameControl.getAnswer)
routerServer.post('/enviarRespuesta', gameControl.validateAnswers)
routerServer.post('/saveGame',gameControl.saveGame)
routerServer.post('/findGame',gameControl.findGame)
routerServer.post('/nuevoJuego',gameControl.createGame)
routerServer.post('/joinGame',gameControl.joinGame)
routerServer.post('/newBoard',gameControl.devolverBoard)
routerServer.post('/verifyEnd',gameControl.verifyEnd)
routerServer.post('/boardComplete',gameControl.boardComplete)
routerServer.post('/infoWinner',gameControl.devolverWinner)

export default routerServer;
