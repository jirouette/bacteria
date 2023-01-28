import { Game } from '../game.js';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from '../socket.js';
import { Server } from 'socket.io';


var games: {[key: string]: Game} = {};

const io = new Server<ServerToClientEvents, ClientToServerEvents, {}, SocketData>();

io.listen(3000);
