import React from "react";
import { Player, TileType } from "../../game";
// @ts-ignore
import sad from './assets/sad.png';

interface Props {
    type: Player
}

export function SadMood({type}: Props) {
    const isPlayerA = () => { return type == TileType.PLAYER_A; };
    const NB_SPRITES = 7;
    const SPRITE_WIDTH = 137;
    const SPRITE_HEIGHT = 125;
    const viewBox = `0 0 ${SPRITE_WIDTH} ${SPRITE_HEIGHT}`;
    const X = (isPlayerA() && 45) || 41;
    const Y = 120;

    const keyframes: Array<String> = [];
    for (let i = 0; i < NB_SPRITES ; ++i) {
        keyframes.push(`${-i * SPRITE_WIDTH} 0`);
    }

    return (
        <svg x={X} y={Y} width={SPRITE_WIDTH} height={SPRITE_HEIGHT} viewBox={viewBox}>
            <image href={sad} x="0" y="0" width={SPRITE_WIDTH * NB_SPRITES} height={SPRITE_HEIGHT}>
                <animateTransform attributeName="transform"
                    type="translate"
                    begin="0s"
                    dur="0.5s"
                    repeatCount="indefinite"
                    calcMode="discrete"
                    values={keyframes.join(";")}
                />
            </image>
        </svg>
    )
}
