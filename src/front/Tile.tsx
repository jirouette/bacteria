import React, { useState } from "react";
import { AnyPlayer, isTilePlayer, TileType } from "../game";
import { Character } from "./tiles/Character";
// @ts-ignore
import styles from "./Tile.module.scss";
import { click } from "./Sound";

interface Props {
    type: TileType;
    player: AnyPlayer|null;
    turnPlayer: AnyPlayer|null;
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
    const hasNotJoinedYet = turnPlayer === null && type !== player && isTilePlayer(type) ? styles.hasNotJoinedYet : "";

    let classes = [styles.tile];
    if (player == turnPlayer) {
        if (type == player || (player == TileType.PLAYER_UNDEFINED && isTilePlayer(type))) {
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
            click.play();
        }
        if (player == turnPlayer && player == TileType.PLAYER_UNDEFINED && isTilePlayer(type)) {
            setPlayScore(playScore);
            click.play();
        }
        return onClick();
    }

    return (
        <button className={classes.join(" ")} onClick={onClickAndAnimate} style={style}>
            <span className={classMap(type) + " " + hasNotJoinedYet}>
            <Character type={type} playScore={tilePlayScore} />
            </span>
        </button>
    );
}
