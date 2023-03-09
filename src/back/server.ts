import { Game, Move } from '../game.js';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from '../socket.js';
import { Server } from 'socket.io';
import { generate, characters } from 'shortid';
import { createServer } from "http";
import { randomBoard } from '../formats.js';

var games: {[key: string]: Game} = {};

const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(httpServer, {cors: {origin: 'http://localhost:3002'}});

io.on('connection', (socket) => {
    console.log("Connection!", socket.id);
    socket.on('createGame', () => {
        let id = generate();
        games[id] = new Game(randomBoard());
        socket.emit('gameCreated', id);
    });

    socket.on('joinGame', (gameId: string) => {
        let game = games[gameId];
        if (! game) {
            return;
        }
        for (let room of socket.rooms) {
            socket.leave(room);
        }
        socket.join(gameId);
        socket.data.gameId = gameId;
        let playerType = game.addPlayer(socket.id);
        socket.emit('gameJoined', game.board, game.turn_player, playerType);
        if (game.canStart()) {
            io.in(gameId).emit('turnChange', game.turn_player);
        }
    });

    socket.on('applyMove', (move: Move) => {
        let gameId = socket.data.gameId || "";
        let game = games[gameId];
        if (! game) {
            return;
        }
        let applied = game.applyMove(move, socket.id);
        if (! applied) {
            return;
        }
        io.in(gameId).emit("applyMove", move);
        io.in(gameId).emit("turnChange", game.turn_player);
        if (game.board.canAPlayerStillPlay(game.turn_player)) {
            return;
        }
        let scores = game.scores();
        io.in(gameId).emit("gameEnded", scores[0], scores[1]);
        delete games[gameId];
    });

});

io.listen(3000);
