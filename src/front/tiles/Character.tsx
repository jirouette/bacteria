import React, { useState } from "react";
import { isTilePlayer, Player, TileType } from "../../game";
import { IdleCharacter } from "./IdleCharacter";
import { TransitionCharacter } from "./TransitionCharacter";
// @ts-ignore
import styles from "./Character.module.scss";

interface Props {
    type: TileType;
    playScore: number;
}

enum Animation {
    PLAYER_APPEARING = 0,
    PLAYER_A_DISAPPEARING,
    PLAYER_B_DISAPPEARING,
    PLAYER_A_TO_B,
    PLAYER_B_TO_A,
    NONE
}

export function Character({type, playScore}: Props) {
    const [tileType, setTileType] = useState<TileType>(TileType.EMPTY);
    const [animation, setAnimation] = useState<Animation>(Animation.NONE);

    if (type !== tileType) {
        setTileType(type);
    }

    if (isTilePlayer(type) && tileType == TileType.EMPTY) {
        animation != Animation.PLAYER_APPEARING && setAnimation(Animation.PLAYER_APPEARING);
    }
    else if (type == TileType.EMPTY && tileType == TileType.PLAYER_A) {
        animation != Animation.PLAYER_A_DISAPPEARING && setAnimation(Animation.PLAYER_A_DISAPPEARING);
    }
    else if (type == TileType.EMPTY && tileType == TileType.PLAYER_B) {
        animation != Animation.PLAYER_B_DISAPPEARING && setAnimation(Animation.PLAYER_B_DISAPPEARING);
    }
    else if (type == TileType.PLAYER_A && tileType == TileType.PLAYER_B) {
        animation != Animation.PLAYER_B_TO_A && setAnimation(Animation.PLAYER_B_TO_A);
    }
    else if (type == TileType.PLAYER_B && tileType == TileType.PLAYER_A) {
        animation != Animation.PLAYER_A_TO_B && setAnimation(Animation.PLAYER_A_TO_B);
    }

    if (animation == Animation.PLAYER_A_DISAPPEARING) {
        return (
            <IdleCharacter type={TileType.PLAYER_A} playScore={playScore} className={styles.disappearing} />
        );
    }
    if (animation == Animation.PLAYER_B_DISAPPEARING) {
        return (
            <IdleCharacter type={TileType.PLAYER_B} playScore={playScore} className={styles.disappearing} />
        );
    }
    if (animation == Animation.PLAYER_APPEARING) {
        return (
            <IdleCharacter type={type as Player} playScore={playScore} className={styles.appearing} />
        );
    }
    if ([Animation.PLAYER_A_TO_B, Animation.PLAYER_B_TO_A].includes(animation)) {
        return (
            <TransitionCharacter
                key={type}
                className={styles.transforming}
                type={type as Player}
                playScore={playScore}
            />
        );
    }

    return null;
}
