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

export type Move = null | {
    origin: Position, 
    destination: Position
};

export type Player = TileType.PLAYER_A|TileType.PLAYER_B;

export function isTilePlayer(tile: TileType): boolean {
    return tile == TileType.PLAYER_A || tile == TileType.PLAYER_B;
}

export function isCloning(move: Move): boolean {
    return move !== null && Math.abs(move.origin.y - move.destination.y) <= 1 && Math.abs(move.origin.x - move.destination.x) <= 1;
}

export function isJumping(move: Move): boolean {
    if (! move) {
        return false;
    }
    let yDist = Math.abs(move.origin.y - move.destination.y);
    let xDist = Math.abs(move.origin.x - move.destination.x);
    return (yDist == 2 && xDist == 0) || (yDist == 0 && xDist == 2);
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

    isLegalMove(move: Move): boolean {
        if (! move) {
            return false;
        }
        if (! this.isOnBoard(move.origin) || ! this.isOnBoard(move.destination)) {
            return false; // position not on board
        }
        if (move.origin.x == move.destination.x && move.origin.y == move.destination.y) {
            return false; // same position
        }
    
        if (! isCloning(move) && ! isJumping(move) ) {
            return false; // destination is not reachable by cloning (1) nor by jumping (2)
        }
    
        const originTile = this[move.origin.y][move.origin.x];
        const destinationTile = this[move.destination.y][move.destination.x];
        if (originTile != TileType.PLAYER_A && originTile != TileType.PLAYER_B) {
            return false; // origin is not a player tile
        }
        if (destinationTile != TileType.EMPTY) {
            return false; // destination is not an empty tile
        }
    
        return true; // any other case is legal
    }

    applyMove(move: Move): boolean {
        if (! move) {
            return false;
        }
        if (! this.isLegalMove(move)) {
            return false; // cannot apply illegal move
        }
    
        let playerTile = this[move.origin.y][move.origin.x];
        if (! isCloning(move)) {
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

    nbPlayPossible(pos: Position): number {
        let nbPlay = 0;
        for (let moveX = pos.x - 2 ; moveX <= (pos.x + 2) ; ++moveX) {
            for (let moveY = pos.y - 2 ; moveY <= (pos.y + 2) ; ++moveY) {
                if (this.isLegalMove({origin: pos, destination: {x: moveX, y: moveY}})) {
                    nbPlay++;
                }
            }
        }
        return nbPlay;
    }

    canAPlayerStillPlay(player: Player): boolean {
        for (let y = 0 ; y < this.length ; ++y) {
            for (let x = 0 ; x < this[y].length ; ++x) {
                let tile = this[y][x];
                if (tile != player) {
                    continue; // tile does not belong to the player
                }

                if (this.nbPlayPossible({x, y}) > 0) {
                    return true; // a legal move is found
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
    moves: Array<Move> = [];
    board: Board;
    turn_player: Player;
    players: Array<any> = [];

    constructor(board: Board, first_turn?: Player) {
        this.board = board;
        if (! first_turn) {
            first_turn = [TileType.PLAYER_A, TileType.PLAYER_B][Math.floor(Math.random() * 2)] as Player;
        }
        this.turn_player = first_turn;
    }

    addPlayer(player: any): Player|null {
        if (this.canStart()) {
            return null;
        }
        this.players.push(player);
        return this.canStart() ? TileType.PLAYER_B : TileType.PLAYER_A;
    }

    canStart(): boolean {
        return this.players.length >= 2;
    }

    isTurnPlayer(player: any): boolean {
        if (! this.canStart()) {
            return false;
        }
        return this.players[Number(this.turn_player !== TileType.PLAYER_A)] === player;
    }

    swapTurnPlayer() {
        this.turn_player = this.turn_player == TileType.PLAYER_A ? TileType.PLAYER_B : TileType.PLAYER_A;
    }

    applyMove(move: Move, player: any): boolean {
        if (! this.isTurnPlayer(player)) {
            return false;
        }
        this.moves.push(move);
        if (! move) {
            this.swapTurnPlayer();
            return true;
        }
        if (! this.board.applyMove(move)) {
            return false;
        }
        this.swapTurnPlayer();
        return true;
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


