import React, { useEffect, useState } from "react";
import { client } from './client';
import { Board as GameBoard, isCloning, isJumping, Move, Player, Position, TileType } from '../game';
import { Tile } from "./Tile";

export function Board() {
    const [board, setBoard] = useState(new GameBoard);
    const [turnPlayer, setTurnPlayer] = useState<Player|null>(null);
    const [player, setPlayer] = useState<Player|null>(null);
    const [selectedTile, selectTile] = useState<Position|null>(null);

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

    const onClick = (x: number, y: number) => {
        if (player !== turnPlayer) {
            return false;
        }
        if (selectedTile === null && board[y][x] !== player) {
            return false;
        }
        if (board[y][x] === player) {
            selectTile({x, y});
            return true;
        }
        const confirmedSelectedTile = selectedTile as Position;
        if (confirmedSelectedTile.x == x && confirmedSelectedTile.y == y) {
            return true;
        }
        if (board[y][x] !== TileType.EMPTY) {
            return false;
        }

        // checking now if we can perform a move
        let move: Move = {origin: confirmedSelectedTile, destination: {x, y}}
        if (! isCloning(move) && ! isJumping(move)) {
            return false;
        }

        client.emit('applyMove', move);
        selectTile(null);
        return true;
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
        <div id="board">
            {(board.map((row, y) => {
                return <div className="row" key={y}>{row.map((tile, x) => {
                    return (<Tile
                        key={`${x}-${y}`}
                        type={tile}
                        player={player}
                        turnPlayer={turnPlayer}
                        movable={selectedTile && isCloning({origin: selectedTile, destination: {x, y}})}
                        jumpable={selectedTile && isJumping({origin: selectedTile, destination: {x, y}})}
                        onClick={() => {return onClick(x, y);}}
                        playScore={board.nbPlayPossible({x, y})}
                    />);
                })}</div>
            }))}
        </div>
    );
}
