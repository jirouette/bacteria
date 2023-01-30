import { Board, Move, Player } from "./game.js";

export interface ServerToClientEvents {
    gameCreated: (gameId: string) => void;
    gameJoined: (board: Board, turn_player: Player, player: Player|null) => void;
    applyMove: (move: Move) => void;
    turnChange: (player: Player) => void;
    gameEnded: (scoreA: number, scoreB: number) => void;
}

export interface ClientToServerEvents {
    createGame: () => void;
    joinGame: (gameId: string) => void;
    leaveGame: (gameId: string) => void;
    applyMove: (move: Move) => void;
}

export interface SocketData {
    gameId: string;
}
