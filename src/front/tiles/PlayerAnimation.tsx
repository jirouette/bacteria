import React from "react";
import { Player, TileType } from "../../game";
// @ts-ignore
import P1 from './assets/P1.png';
// @ts-ignore
import P2 from './assets/P2.png';
import { Mood } from "./Mood";

interface Props {
    type: Player;
    playScore: number;
}

export function PlayerAnimation({type, playScore}: Props) {
    const isPlayerA = () => { return type == TileType.PLAYER_A; };
    const NB_SPRITES = 37;
    const SPRITE_WIDTH = (isPlayerA() && 234) || 226;
    const SPRITE_HEIGHT = (isPlayerA() && 276) || 278;
    const viewBox = `0 0 ${SPRITE_WIDTH} ${SPRITE_HEIGHT}`;
    const animationDelay = 4;

    const keyframes: Array<String> = [];
    for (let i = 0; i < NB_SPRITES ; ++i) {
        keyframes.push(`${-i * SPRITE_WIDTH} 0`);
    }
    keyframes.push(...Array(NB_SPRITES * animationDelay).fill("0 0"));

    return (
        <svg width="60" height="70" viewBox={viewBox} preserveAspectRatio="none">
            <image
                href={isPlayerA() && P1 || P2}
                x="0"
                y="0"
                width={NB_SPRITES * SPRITE_WIDTH}
                height={SPRITE_HEIGHT}
            >
                <animateTransform attributeName="transform"
                    type="translate"
                    begin={`${Math.random()*4}s`}
                    dur={`${1+animationDelay}s`}
                    repeatCount="indefinite"
                    calcMode="discrete"
                    values={keyframes.join(";")}
                />
            </image>
            <Mood type={type} playScore={playScore} />
        </svg>
    )
}
