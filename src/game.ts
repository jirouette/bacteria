import { maps } from "./maps.js";
import { parseBoard } from "./formats.js";

export enum TileType {
    EMPTY = 0,
    WALL,
    PLAYER_A,
    PLAYER_B
};

export type Position = {
    x: number,
    y: number
};

export type Move = {
    origin: Position, 
    destination: Position
};

export type Player = TileType.PLAYER_A|TileType.PLAYER_B;

export function isCloning(origin: Position, destination: Position): boolean {
    return Math.abs(origin.y - destination.y) <= 1 && Math.abs(origin.x - destination.x) <= 1;
}

export class Board extends Array<Array<TileType>>
{
    displayBoard() {
        for(const layer of this) {
            console.log(layer.join(""));
        }
    }

    isOnBoard(point: Position): boolean {
        if (point.x % 1 !== 0 || point.y % 1 !== 0) {
            return false; // not an integer
        }
        if (point.y >= this.length || point.y < 0) {
            return false; // out-of-bound on Y-axis
        }
        if (point.x >=  this[point.y].length || point.x < 0) {
            return false; // out-of-bound on X-axis
        }
        return true;
    }

    isAPlayerTile(position: Position): boolean {
        let tile = this[position.y][position.x];
        return tile == TileType.PLAYER_A || tile == TileType.PLAYER_B;
    }

    isLegalMove(origin: Position, destination: Position): boolean {
        if (! this.isOnBoard(origin) || ! this.isOnBoard(destination)) {
            return false; // position not on board
        }
        if (origin.x == destination.x && origin.y == destination.y) {
            return false; // same position
        }
        if (origin.x != destination.x && origin.y != destination.y) {
            return false; // move on both axis
        }
        
        const differenceY = Math.abs(origin.y - destination.y);
        const differenceX = Math.abs(origin.y - destination.x);
    
        if (differenceX > 2 && differenceY > 2) {
            return false; // destination is not reachable by cloning (1) nor by jumping (2)
        }
    
        const originTile = this[origin.y][origin.x];
        const destinationTile = this[destination.y][destination.x];
        if (originTile != TileType.PLAYER_A && originTile != TileType.PLAYER_B) {
            return false; // origin is not a player tile
        }
        if (destinationTile != TileType.EMPTY) {
            return false; // destination is not an empty tile
        }
    
        return true; // any other case is legal
    }

    applyMove(move: Move): boolean {
        if (! this.isLegalMove(move.origin, move.destination)) {
            return false; // cannot apply illegal move
        }
    
        let playerTile = this[move.origin.y][move.origin.x];
        if (! isCloning(move.origin, move.destination)) {
            // the bacteria is jumping, so its previous position is now empty
            this[move.origin.y][move.origin.x] = TileType.EMPTY;
        }
    
        this[move.destination.y][move.destination.x] = playerTile;
        for (let x = move.destination.x - 1 ; x <= (move.destination.x + 1) ; ++x) {
            for (let y = move.destination.y - 1 ; y <= (move.destination.y + 1) ; ++y) {
                let pos = {x, y}
                if (this.isOnBoard(pos) && this.isAPlayerTile(pos)) {
                    this[y][x] = playerTile;
                }
            }
        }
        return true; // move applied
    }

    canAPlayerStillPlay(player: Player): boolean {
        for (let y = 0 ; y < this.length ; ++y) {
            for (let x = 0 ; x < this[y].length ; ++x) {
                let tile = this[y][x];
                if (tile != player) {
                    continue; // tile does not belong to the player
                }
    
                for (let moveX = x - 1 ; moveX <= (x + 1) ; ++moveX) {
                    for (let moveY = y - 1 ; moveY <= (y + 1) ; ++moveY) {
                        if (this.isLegalMove({x, y}, {x: moveX, y: moveY})) {
                            return true; // a legal move is found
                        }
                    }
                }
            }
        }
        return false; // no legal move found
    }
    
    scoreOfPlayer(player: Player): number {
        return this.reduce((sum, layer) => sum + layer.filter(tile => tile == player).length, 0);
    }

    isGameFinished(): boolean {
        return ! this.canAPlayerStillPlay(TileType.PLAYER_A) || ! this.canAPlayerStillPlay(TileType.PLAYER_B);
    }
}

export class Game {
    moves: Array<Move|null> = [];
    board: Board;
    turn_player: Player;

    constructor(board: Board, first_turn?: Player) {
        this.board = board;
        if (! first_turn) {
            first_turn = [TileType.PLAYER_A, TileType.PLAYER_B][Math.floor(Math.random() * 2)] as Player;
        }
        this.turn_player = first_turn;
    }

    applyMove(move?: Move, player?: Player): boolean {
        if (this.turn_player && this.turn_player !== player) {
            return false;
        }
        this.moves.push(move ? move : null);
        if (! move) {
            return true;
        }
        return this.board.applyMove(move);
    }

    scores(): Array<number> {
        return [
            this.board.scoreOfPlayer(TileType.PLAYER_A),
            this.board.scoreOfPlayer(TileType.PLAYER_B)
        ];
    }

    isFinished(): boolean {
        return this.board.isGameFinished();
    }
}

export function randomBoard(): Board {
    const map = maps[Math.floor(Math.random() * maps.length)];
    return parseBoard(map);
}
