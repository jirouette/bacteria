import React, { useState } from "react";
import { Board as GameBoard, TileType } from "../game";
import { end } from "./Sound";
// @ts-ignore
import styles from "./End.module.scss";
import { IdleCharacter } from "./tiles/IdleCharacter";
interface Props {
    board: GameBoard
}

export function End({ board }: Props) {
    const [isClosed, close] = useState<boolean>(false);
    const scorePlayerA = board.scoreOfPlayer(TileType.PLAYER_A);
    const scorePlayerB = board.scoreOfPlayer(TileType.PLAYER_B);

    if (isClosed) {
        return null;
    }

    setTimeout(() => { end.play() }, 500);

    let sentence = "DRAW";
    if (scorePlayerA > scorePlayerB) {
        sentence = "Reds win";
    }
    else if (scorePlayerA < scorePlayerB) {
        sentence = "Greens win";
    }

    return (<>
        <button
            onClick={() => close(true)}
            className={styles.return}
        >
            Return
        </button>
        <section className={styles.result}>
            {sentence}
        </section>
        <section className={`${styles.end} ${styles.playerA}`}>
            <div className={styles.playerAcontent}>
                <div className={styles.characterBubble}>
                    <IdleCharacter
                        type={TileType.PLAYER_A}
                        playScore={scorePlayerA > scorePlayerB ? 10 : 0}
                        className={styles.character}
                    />
                </div>
                <div>{scorePlayerA}</div>
            </div>
        </section>
        <section className={`${styles.end} ${styles.playerB}`}>
            <div className={styles.playerBcontent}>
                <div className={styles.characterBubble}>
                    <IdleCharacter
                        type={TileType.PLAYER_B}
                        playScore={scorePlayerA < scorePlayerB ? 10 : 0}
                        className={styles.character}
                    />
                </div>
                <div>{scorePlayerB}</div>
            </div>
        </section>
    </>);
}
