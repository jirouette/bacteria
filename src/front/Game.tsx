import React, { useEffect, useState } from "react";
import { client } from './client';
import { Board as GameBoard, Move, Player } from '../game';
import { Board } from "./Board";

export function Game() {
    const [board, setBoard] = useState(new GameBoard);
    const [turnPlayer, setTurnPlayer] = useState<Player|null>(null);
    const [player, setPlayer] = useState<Player|null>(null);

    const onGameJoined = (newBoard: GameBoard, _: Player, newPlayer: Player|null) => {
        setBoard(new GameBoard(...newBoard));
        setPlayer(newPlayer);
    };

    const onTurnChange = (newTurnPlayer: Player) => {
        setTurnPlayer(newTurnPlayer);
    };

    const onMove = (move: Move) => {
        board.applyMove(move);
        setBoard(new GameBoard(...board)); 
    }

    const play = (move: Move) => {
        client.emit('applyMove', move);
    }

    useEffect(() => {
        client.on('gameJoined', onGameJoined);
        client.on('turnChange', onTurnChange);
        client.on('applyMove', onMove);

        return () => {
            client.off('gameJoined', onGameJoined);
            client.off('turnChange', onTurnChange);
            client.off('applyMove', onMove);
        }
    }, [board]);

    return (
        <Board
            player={player}
            turnPlayer={turnPlayer}
            rows={board}
            play={play}
        />
    );
}
