import React from "react";
import { Player, TileType } from "../../game";
// @ts-ignore
import tongue from './assets/tongue.png';

interface Props {
    type: Player
}

export function TongueMood({type}: Props) {
    const isPlayerA = () => { return type == TileType.PLAYER_A; };
    const SPRITE_WIDTH = 179;
    const SPRITE_HEIGHT = 135;
    const X = (isPlayerA() && 32) || 24;
    const Y = 120;

    return (
        <image href={tongue} x={X} y={Y} width={SPRITE_WIDTH} height={SPRITE_HEIGHT} />
    )
}
