import React from "react";
import { Player, TileType } from "../game";
// @ts-ignore
import styles from "./Tile.module.scss";

interface Props {
    type: TileType;
    player: Player|null;
    turnPlayer: Player|null;
    movable: boolean|null;
    jumpable: boolean|null;
    onClick: () => boolean;
}

export function Tile({type, player, turnPlayer, movable, jumpable, onClick}: Props) {
    const classMap = (tile: TileType) => {
        switch(tile) {
            case TileType.PLAYER_A: return styles.playerA;
            case TileType.PLAYER_B: return styles.playerB;
            case TileType.EMPTY: return styles.empty;
            case TileType.WALL: return styles.wall;
        }
    };

    let classes = styles.tile+" "+classMap(type);
    if (player == turnPlayer) {
        if (type == player) {
            classes += " "+styles.playable;
        }
        else if (type == TileType.EMPTY && movable) {
            classes += " "+styles.movable;
        }
        else if (type == TileType.EMPTY && jumpable) {
            classes += " "+styles.jumpable;
        }
    }

    return (
        <button className={classes} onClick={onClick}></button>
    );
}
