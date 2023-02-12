import React, { useState } from "react";
import { Board as GameBoard, isCloning, isJumping, Move, Player, Position, TileType } from '../game';
import { Tile } from "./Tile";
// @ts-ignore
import styles from "./Board.module.scss";

interface Props {
    player: Player|null;
    turnPlayer: Player|null;
    rows: GameBoard;
    play: (move: Move) => void;
}

export function Board({player, turnPlayer, rows, play}: Props) {
    const [selectedTile, selectTile] = useState<Position|null>(null);

    const onClick = (x: number, y: number) => {
        if (player !== turnPlayer) {
            return false;
        }
        if (selectedTile === null && rows[y][x] !== player) {
            return false;
        }
        if (rows[y][x] === player) {
            selectTile({x, y});
            return true;
        }
        const confirmedSelectedTile = selectedTile as Position;
        if (confirmedSelectedTile.x == x && confirmedSelectedTile.y == y) {
            return true;
        }
        if (rows[y][x] !== TileType.EMPTY) {
            return false;
        }

        // checking now if we can perform a move
        let move: Move = {origin: confirmedSelectedTile, destination: {x, y}}
        if (! isCloning(move) && ! isJumping(move)) {
            return false;
        }

        play(move);
        selectTile(null);
        return true;
    }

    return (
        <div id="board">
            {(rows.map((row, y) => {
                return <div className={styles.row} key={y}>{row.map((tile, x) => {
                    return (<Tile
                        key={`${x}-${y}`}
                        type={tile}
                        player={player}
                        turnPlayer={turnPlayer}
                        movable={selectedTile && isCloning({origin: selectedTile, destination: {x, y}})}
                        jumpable={selectedTile && isJumping({origin: selectedTile, destination: {x, y}})}
                        onClick={() => {return onClick(x, y);}}
                        playScore={rows.nbPlayPossible({x, y})}
                        style={{left: `${x*100}px`}}
                    />);
                })}</div>
            }))}
        </div>
    );
}
