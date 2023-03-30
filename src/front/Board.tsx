import React, { useState } from "react";
import { AnyPlayer, Board as GameBoard, isCloning, isJumping, isTilePlayer, Move, Position, TileType } from '../game';
import { Tile } from "./Tile";
// @ts-ignore
import styles from "./Board.module.scss";

interface Props {
    player: AnyPlayer|null;
    turnPlayer: AnyPlayer|null;
    rows: GameBoard;
    play: (move: Move) => void;
    style?: React.CSSProperties;
}

export function Board({player, turnPlayer, rows, play, style}: Props) {
    const [selectedTile, selectTile] = useState<Position|null>(null);

    const onClick = (x: number, y: number) => {
        if (player !== turnPlayer) {
            return false;
        }
        if (selectedTile === null && player !== rows[y][x] && player !== TileType.PLAYER_UNDEFINED) {
            return false;
        }
        if (player === rows[y][x] || (isTilePlayer(rows[y][x]) && player === TileType.PLAYER_UNDEFINED)) {
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

    let boardStyle: React.CSSProperties = {width: `${rows.length*100}px`};
    if (style !== undefined) {
        boardStyle = {...boardStyle, ...style}
    }

    return (
        <div className={styles.board} style={boardStyle}>
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
