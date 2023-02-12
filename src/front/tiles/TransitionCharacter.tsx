import React from "react";
import { Player, TileType } from "../../game";
import { IdleCharacter } from "./IdleCharacter";
import { TransitionPart } from "./TransitionPart";
// @ts-ignore
import styles from "./Character.module.scss";

interface Props {
    type: Player;
    playScore: number;
}

export function TransitionCharacter({type, playScore}: Props) {
    return (
        <svg>
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
