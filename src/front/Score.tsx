import React from "react";
import { Board as GameBoard, TileType } from '../game';
// @ts-ignore
import styles from "./Score.module.scss";

interface Props {
    board: GameBoard;
}

export function Score({ board }: Props) {
    return (
        <div className={styles.score}>
            <span className={styles.playerA}>{board.scoreOfPlayer(TileType.PLAYER_A)}</span>
            -
            <span className={styles.playerB}>{board.scoreOfPlayer(TileType.PLAYER_B)}</span>
        </div>
    );
}
