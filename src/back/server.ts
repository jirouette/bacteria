import { Board, TileType } from '../game.js';

const board = new Board(
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
    [TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL],
    [TileType.EMPTY, TileType.PLAYER_A, TileType.EMPTY, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.PLAYER_B, TileType.EMPTY],
    [TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL]
);

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
