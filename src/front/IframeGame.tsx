import React, { useState } from "react";
import { AnyPlayer, Board as GameBoard, isTilePlayer, Move, opponentOf, Player, TileType } from '../game';
import { Board } from "./Board";
import { parseBoard, randomBoard } from '../formats';
import { useParams } from "react-router-dom";
import { muteAll } from "./Sound";

const randomPlayer = () => {
    return [TileType.PLAYER_A, TileType.PLAYER_B][Math.floor(Math.random() * 2)] as Player;
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

export function IframeGame({ board }: Props) {
    const { tiles, player } = useParams<{ tiles?: string, player?: string }>();
    const [gameBoard] = useState(board || (tiles && parseBoard(tiles)) || randomBoard());
    const [turnPlayer, setTurnPlayer] = useState<AnyPlayer>(firstPlayer(player));
    const [_, setLastMove] = useState<Move>(null);

    muteAll();

    const play = (move: Move) => {
        if (! move) {
            return;
        }
        if (! gameBoard.applyMove(move)) {
            return;
        }
        setLastMove(move);
        const player = gameBoard.get(move.destination);
        if (! isTilePlayer(player)) {
            return;
        }
        const opponent = opponentOf(player as Player);
        setTurnPlayer(opponent);
    }

    const finished = turnPlayer !== TileType.PLAYER_UNDEFINED && !gameBoard.canAPlayerStillPlay(turnPlayer);
    if (finished) {
        gameBoard.fillAs(opponentOf(turnPlayer));
    }

    return (
        <>
            <Board
                player={turnPlayer}
                turnPlayer={turnPlayer}
                rows={gameBoard}
                play={play}
                style={{margin: 0}}
            />
            <style>{"html, body, #root >div { background-color: transparent; }"}</style>
        </>
    );
}
