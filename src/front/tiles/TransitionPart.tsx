import React from "react";
import { Player, TileType } from "../../game";
// @ts-ignore
import P1 from './assets/P1_transition.png';
// @ts-ignore
import P2 from './assets/P2_transition.png';

interface Props {
    className: string;
    part: Player;
    type: Player;
}

export function TransitionPart({type, part, className}: Props) {
    const isPlayerA = () => { return part == TileType.PLAYER_A; };
    const NB_SPRITES = (isPlayerA() && 25) || 19;
    const NB_FRAMES = 40;
    const SPRITE_WIDTH = (isPlayerA() && 106) || 103;
    const SPRITE_HEIGHT = (isPlayerA() && 161) || 127;
    const VIEWBOX = `0 0 ${SPRITE_WIDTH} ${SPRITE_HEIGHT}`;

    const keyframes: Array<String> = [];
    for (let i = 0; i < NB_SPRITES ; ++i) {
        keyframes.push(`${-i * SPRITE_WIDTH} 0`);
    }
    const padding = Array(NB_FRAMES - NB_SPRITES).fill(`${SPRITE_WIDTH} 0`);
    if (isPlayerA()) {
        keyframes.push(...padding);
    }
    else {
        keyframes.unshift(...padding);
    }

    if (type == TileType.PLAYER_A) {
        keyframes.reverse();
    }

    return (
        <svg
            width="60"
            height="91"
            viewBox={VIEWBOX}
            preserveAspectRatio="none"
            className={className}
        >
            <image
                href={(isPlayerA() && P1) || P2}
                x="0"
                y="0"
                width={NB_SPRITES * SPRITE_WIDTH}
                height={SPRITE_HEIGHT}
            >
                <animateTransform attributeName="transform"
                    type="translate"
                    begin="0s"
                    dur="1s"
                    repeatCount="1"
                    calcMode="discrete"
                    values={keyframes.join(";")}
                    fill="freeze"
                />
            </image>
        </svg>
    )
}
