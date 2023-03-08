import React, { useState } from "react";
import { Board as GameBoard, isCloning, isJumping, Move, TileType } from '../game';
// @ts-ignore
import styles from "./Sound.module.scss";
// @ts-ignore
import copywav from "./tiles/assets/copy.wav";
// @ts-ignore
import jumpwav from "./tiles/assets/jump.wav";
// @ts-ignore
import P1_1mp3 from "./tiles/assets/P1_1.mp3";
// @ts-ignore
import P1_2mp3 from "./tiles/assets/P1_2.mp3";
// @ts-ignore
import P1_3mp3 from "./tiles/assets/P1_3.mp3";
// @ts-ignore
import P2_1mp3 from "./tiles/assets/P2_1.mp3";
// @ts-ignore
import P2_2mp3 from "./tiles/assets/P2_2.mp3";
// @ts-ignore
import P2_3mp3 from "./tiles/assets/P2_3.mp3";
// @ts-ignore
import clickmp3 from "./tiles/assets/click.mp3";
// @ts-ignore
import endmp3 from "./tiles/assets/end.mp3";

interface Props {
    board: GameBoard;
    move: Move;
}

interface Score {
    playerA: number;
    playerB: number;
}

const getScore = (board: GameBoard) => {
    return {
        playerA: board.scoreOfPlayer(TileType.PLAYER_A),
        playerB: board.scoreOfPlayer(TileType.PLAYER_B)
    };
}

const hasScoreChanged = (score: Score, newScore: Score) => {
    return score.playerA !== newScore.playerA || score.playerB !== newScore.playerB;
}

const rand = (arr: Array<any>) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const copy = new Audio(copywav);
export const jump = new Audio(jumpwav);
export const P1_1 = new Audio(P1_1mp3);
export const P1_2 = new Audio(P1_2mp3);
export const P1_3 = new Audio(P1_3mp3);
export const P2_1 = new Audio(P2_1mp3);
export const P2_2 = new Audio(P2_2mp3);
export const P2_3 = new Audio(P2_3mp3);
export const click = new Audio(clickmp3);
export const end = new Audio(endmp3);

const allSounds = [copy, jump, P1_1, P1_2, P1_3, P2_1, P2_2, P2_3, click, end];

let isMuted = false;

export function Sound({ board, move }: Props) {
    const newScore = getScore(board);
    const [lastMove, setLastMove] = useState<Move>(null);
    const [score, setScore] = useState<Score>(newScore);
    const [_, setVolume] = useState(false);

    if (lastMove != move)
    {
        if (isCloning(move)) {
            copy.play();
        }
        else if (isJumping(move)) {
            jump.play();
        }
        setLastMove(move);
    }


    const playerAdiff = score.playerA - newScore.playerA;
    const playerBdiff = score.playerB - newScore.playerB;

    if (playerAdiff >= 7) {
        P1_3.play();
    }
    else if (playerAdiff > 0) {
        rand([P1_1, P1_2]).play();
    }

    if (playerBdiff >= 7) {
        P2_3.play();
    }
    else if (playerBdiff > 0) {
        rand([P2_1, P2_2]).play();
    }


    if (hasScoreChanged(score, newScore)) {
        setScore(newScore);
    }

    const toggleVolume = () => {
        isMuted = ! isMuted;
        allSounds.map((sound) => {
            sound.muted = isMuted;
        });
        setVolume(isMuted);
    }

    return (
        <button onClick={toggleVolume} className={styles.volume}>
            {isMuted ? "🔇" : "🔊"}
        </button>
    );
}
