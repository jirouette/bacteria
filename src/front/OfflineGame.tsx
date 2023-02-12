import React, { useState } from "react";
import { AnyPlayer, Board as GameBoard, isTilePlayer, Move, Player, TileType } from '../game';
import { Board } from "./Board";
import { parseBoard, randomBoard } from '../formats';
import { useNavigate, useParams } from "react-router-dom";

const randomPlayer = () => {
    return [TileType.PLAYER_A, TileType.PLAYER_B][Math.floor(Math.random() * 2)] as Player;
}

const opponentOf = (player: Player) => {
    return player == TileType.PLAYER_A ? TileType.PLAYER_B : TileType.PLAYER_A;
}

const firstPlayer = (player?: string) => {
    if (! player) {
        return randomPlayer();
    }
    const parsedPlayer = parseInt(player) as Player;
    if (! isTilePlayer(parsedPlayer)) {
        return TileType.PLAYER_UNDEFINED;
    }
    return parsedPlayer;
}

interface Props {
    board?: GameBoard;
}

export function OfflineGame({ board }: Props) {
    const { tiles, player } = useParams<{ tiles?: string, player?: string }>();
    const [gameBoard] = useState(board || (tiles && parseBoard(tiles)) || randomBoard());
    const [turnPlayer, setTurnPlayer] = useState<AnyPlayer>(firstPlayer(player));
    const navigate = useNavigate();

    const play = (move: Move) => {
        if (! move) {
            return;
        }
        if (! gameBoard.applyMove(move)) {
            return;
        }
        const player = gameBoard.get(move.destination);
        if (! isTilePlayer(player)) {
            return;
        }
        const opponent = opponentOf(player as Player);
        setTurnPlayer(opponent);
        if (tiles) {
            navigate(`/game/${gameBoard}/${opponent}`);
        }
    }

    return (
        <Board
            player={turnPlayer}
            turnPlayer={turnPlayer}
            rows={gameBoard}
            play={play}
        />
    );
}
