import React, { useEffect, useState } from "react";
import { client } from './client';
import { Board as GameBoard, Move, opponentOf, Player } from '../game';
import { Board } from "./Board";
import { useNavigate, useParams } from "react-router-dom";
import { Sound } from "./Sound";
import { Score } from "./Score";
import { End } from "./End";
// @ts-ignore
import styles from "./buttons.module.scss";

export function OnlineGame() {
    const { gameId } = useParams<{ gameId: string }>();
    const [isConnected, setConnectedStatus] = useState(false);
    const [board, setBoard] = useState(new GameBoard);
    const [turnPlayer, setTurnPlayer] = useState<Player|null>(null);
    const [player, setPlayer] = useState<Player|null>(null);
    const [lastMove, setLastMove] = useState<Move>(null);
    const navigate = useNavigate();

    const onConnectionEvent = () => {
        setConnectedStatus(client.connected);
    };

    const onConnect = () => {
        client.emit('joinGame', gameId);
    }

    const onGameJoined = (newBoard: GameBoard, _: Player, newPlayer: Player|null) => {
        setBoard(new GameBoard(...newBoard));
        setPlayer(newPlayer);
    };

    const onTurnChange = (newTurnPlayer: Player) => {
        setTurnPlayer(newTurnPlayer);
    };

    const onMove = (move: Move) => {
        board.applyMove(move);
        setLastMove(move);
        setBoard(new GameBoard(...board));
    }

    const play = (move: Move) => {
        client.emit('applyMove', move);
    }

    useEffect(() => {
        if (! isConnected && client.connected) {
            onConnect();
            onConnectionEvent();
        }
        else {
            client.once('connect', onConnect);
        }
        client.on('connect', onConnectionEvent);
        client.on('disconnect', onConnectionEvent);
        client.on('gameJoined', onGameJoined);
        client.on('turnChange', onTurnChange);
        client.on('applyMove', onMove);

        return () => {
            client.off('connect', onConnectionEvent);
            client.off('disconnect', onConnectionEvent);
            client.off('gameJoined', onGameJoined);
            client.off('turnChange', onTurnChange);
            client.off('applyMove', onMove);
        }
    }, [board]);

    const finished = turnPlayer !== null && ! board.canAPlayerStillPlay(turnPlayer);
    if (finished) {
        board.fillAs(opponentOf(turnPlayer));
    }

    return (
        <>
            <Score board={board} />
            <Board
                player={player}
                turnPlayer={turnPlayer}
                rows={board}
                play={play}
            />
            <Sound board={board} move={lastMove} />
            <button className={styles.goback} onClick={() => { navigate('/');}}>
                Quit
            </button>
            {finished && (<End board={board} />)}
        </>
    );
}
