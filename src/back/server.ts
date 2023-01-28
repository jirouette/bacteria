import { parseBoard } from '../formats.js';
import { TileType } from '../game.js';

const board = parseBoard("00001 11111 02001 00301 11111");

console.log(board);

board.displayBoard();
console.log('--');
console.log("Game finished ? ", board.isGameFinished());
console.log("Score", board.scoreOfPlayer(TileType.PLAYER_A), "-", board.scoreOfPlayer(TileType.PLAYER_B));
console.log('--');
board.applyMove({x: 1, y: 2}, {x: 3, y: 2});
board.displayBoard();
console.log("Game finished ? ", board.isGameFinished());
console.log("Score", board.scoreOfPlayer(TileType.PLAYER_A), "-", board.scoreOfPlayer(TileType.PLAYER_B));
