import React from "react";
import { Player, TileType } from "../../game";
// @ts-ignore
import happy from './assets/happy.png';

interface Props {
    type: Player
}

export function HappyMood({type}: Props) {
    const isPlayerA = () => { return type == TileType.PLAYER_A; };
    const SPRITE_WIDTH = 179;
    const SPRITE_HEIGHT = 131;
    const X = (isPlayerA() && 32) || 24;
    const Y = 120;

    return (
        <image href={happy} x={X} y={Y} width={SPRITE_WIDTH} height={SPRITE_HEIGHT} />
    )
}
