import React, { useState } from "react";
import { AnyPlayer, Board as GameBoard, isTilePlayer, Move, opponentOf, Player, TileType } from '../game';
import { Board } from "./Board";
import { parseBoard, randomBoard } from '../formats';
import { useNavigate, useParams } from "react-router-dom";
import { Sound } from "./Sound";
import { Score } from "./Score";
import { End } from "./End";
// @ts-ignore
import styles from "./buttons.module.scss";

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

export function OfflineGame({ board }: Props) {
    const { tiles, player } = useParams<{ tiles?: string, player?: string }>();
    const [gameBoard] = useState(board || (tiles && parseBoard(tiles)) || randomBoard());
    const [turnPlayer, setTurnPlayer] = useState<AnyPlayer>(firstPlayer(player));
    const [lastMove, setLastMove] = useState<Move>(null);
    const navigate = useNavigate();

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
        if (tiles) {
            navigate(`/game/${gameBoard}/${opponent}`);
        }
    }

    const finished = turnPlayer !== TileType.PLAYER_UNDEFINED && !gameBoard.canAPlayerStillPlay(turnPlayer);
    if (finished) {
        gameBoard.fillAs(opponentOf(turnPlayer));
    }

    return (
        <>
            <Score board={gameBoard} />
            <Board
                player={turnPlayer}
                turnPlayer={turnPlayer}
                rows={gameBoard}
                play={play}
            />
            <Sound board={gameBoard} move={lastMove} />
            <button className={styles.goback} onClick={() => { navigate('/');}}>
                Go back
            </button>
            {finished && (<End board={gameBoard} />)}
        </>
    );
}
