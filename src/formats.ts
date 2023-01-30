import { Board, TileType } from './game';
import { maps } from './maps';

function parseRow(sequence: string): Array<TileType> {
    let row: Array<TileType> = [];
    for (let char of sequence) {
        row.push(parseInt(char) as TileType);
    }
    return row;
}

export function parseBoard(sequence: string): Board {
    let trimmed_sequence = sequence.replaceAll(/\s/g, "");
    let size = Math.sqrt(trimmed_sequence.length); // board must be a square
    if (size % 1 !== 0) {
        throw new Error("Board sequence is not well formatted.");
    }
    let rows: Array<Array<TileType>> = [];
    for (let i = 0 ; i < size ; ++i) {
        rows.push(parseRow(trimmed_sequence.slice(i*size, i*size+size)));
    }

    // @ts-ignore
    return new Board(...rows);
}

export function randomBoard(): Board {
    const map = maps[Math.floor(Math.random() * maps.length)];
    return parseBoard(map);
}
