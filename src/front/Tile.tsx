import React, { useState } from "react";
import { Player, TileType } from "../game";
import { Character } from "./tiles/Character";
// @ts-ignore
import styles from "./Tile.module.scss";

interface Props {
    type: TileType;
    player: Player|null;
    turnPlayer: Player|null;
    movable: boolean|null;
    jumpable: boolean|null;
    onClick: () => boolean;
    playScore: number;
    style: React.CSSProperties
}

export function Tile({type, player, turnPlayer, movable, jumpable, onClick, playScore, style}: Props) {
    const [tilePlayScore, setPlayScore] = useState(-1);
    const [tileType, setTileType] = useState(type);

    if (tileType != type) {
        setTileType(type);
        setPlayScore(-1);
    }

    const classMap = (tile: TileType) => {
        switch(tile) {
            case TileType.EMPTY: return styles.empty;
            case TileType.WALL: return styles.wall;
            default: return styles.player;
        }
    };

    let classes = [styles.tile];
    if (player == turnPlayer) {
        if (type == player) {
            classes.push(styles.playable);
        }
        else if (type == TileType.EMPTY && movable) {
            classes.push(styles.movable);
        }
        else if (type == TileType.EMPTY && jumpable) {
            classes.push(styles.jumpable);
        }
    }

    const onClickAndAnimate = () => {
        if (player == turnPlayer && type == player) {
            setPlayScore(playScore);
        }
        return onClick();
    }

    return (
        <button className={classes.join(" ")} onClick={onClickAndAnimate} style={style}>
            <span className={classMap(type)}>
            <Character type={type} playScore={tilePlayScore} />
            </span>
        </button>
    );
}
