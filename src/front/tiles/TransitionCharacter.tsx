import React from "react";
import { Player, TileType } from "../../game";
import { IdleCharacter } from "./IdleCharacter";
import { TransitionPart } from "./TransitionPart";
// @ts-ignore
import styles from "./Character.module.scss";

interface Props {
    type: Player;
    playScore: number;
    className?: string;
}

export function TransitionCharacter({type, playScore, className}: Props) {
    return (
        <svg className={className}>
            <TransitionPart
                type={type}
                part={TileType.PLAYER_A}
                className={styles.transitionAnimationOut} 
            />
            <TransitionPart
                type={type}
                part={TileType.PLAYER_B}
                className={styles.transitionAnimationOut} 
            />
            <IdleCharacter type={type} playScore={playScore} className={styles.transitionSpriteIn} />
        </svg>
    )
}
