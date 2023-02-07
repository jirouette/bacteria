import React from "react";
import { Player, TileType } from "../../game";
// @ts-ignore
import normal from './assets/normal.png';

interface Props {
    type: Player
}

export function NormalMood({type}: Props) {
    const isPlayerA = () => { return type == TileType.PLAYER_A; };
    const NB_SPRITES = 2;
    const SPRITE_WIDTH = 175;
    const SPRITE_HEIGHT = 111;
    const viewBox = `0 0 ${SPRITE_WIDTH} ${SPRITE_HEIGHT}`;
    const X = (isPlayerA() && 32) || 24;
    const Y = 120;

    return (
        <svg x={X} y={Y} width={SPRITE_WIDTH} height={SPRITE_HEIGHT} viewBox={viewBox}>
            <image href={normal} x="0" y="0" width={SPRITE_WIDTH * NB_SPRITES} height={SPRITE_HEIGHT}>
                <animateTransform attributeName="transform"
                    type="translate"
                    begin={`${Math.random()*4}s`}
                    dur="10s"
                    repeatCount="indefinite"
                    calcMode="discrete"
                    values={"0 0; -175 0;"+Array(100).fill("0 0").join(";")}
                />
            </image>
        </svg>
    )
}
