import React, { useState } from "react";
import { isTilePlayer, Player, TileType } from "../game";
import { PlayerAnimation } from "./tiles/PlayerAnimation";
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
}

export function Tile({type, player, turnPlayer, movable, jumpable, onClick, playScore}: Props) {
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

    if (! isTilePlayer(type))
        return (
            <button className={classes.join(" ")} onClick={onClick}><span className={classMap(type)}></span></button>
        );
    return (
        <button className={classes.join(" ")} onClick={onClickAndAnimate}>
            <PlayerAnimation type={type as Player} playScore={tilePlayScore} />
        </button>
    );
}
