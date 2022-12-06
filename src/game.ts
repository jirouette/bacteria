enum TileType {
    EMPTY = 0,
    WALL,
    PLAYER_A,
    PLAYER_B
};

type Map = Array<Array<TileType>>;

type Position = {
    x: number,
    y: number
};

function displayMap(map: Map) {
    for(const layer of map) {
        console.log(layer.join(""));
    }
}

function isAPositionOnMap(map: Map, point: Position): boolean {
    if (point.x % 1 !== 0 || point.y % 1 !== 0) {
        return false; // not an integer
    }
    if (point.x < 0 || point.y < 0) {
        return false; // out-of-bound
    }
    if (point.y >= map.length) {
        return false; // out-of-bound on Y-axis
    }
    if (point.x >=  map[point.y].length) {
        return false; // out-of-bound on X-axis
    }
    return true;
}

function isCloning(origin: Position, destination: Position): boolean {
    return Math.abs(origin.y - destination.y) <= 1 && Math.abs(origin.x - destination.x) <= 1;
}
function isAPlayerTile(map: Map, position: Position): boolean {
    let tile = map[position.y][position.x];
    return tile == TileType.PLAYER_A || tile == TileType.PLAYER_B;
}

function isLegalMove(map: Map, origin: Position, destination: Position): boolean {
    if (! isAPositionOnMap(map, origin) || ! isAPositionOnMap(map, destination)) {
        return false; // position not on map
    }
    if (origin.x == destination.x && origin.y == destination.y) {
        return false; // same position
    }
    if (origin.x != destination.x && origin.y != destination.y) {
        return false; // move on both axis
    }
    
    const differenceY = Math.abs(origin.y - destination.y);
    const differenceX = Math.abs(origin.y - destination.x);

    if (differenceX > 2 && differenceY > 2) {
        return false; // destination is not reachable by cloning (1) nor by jumping (2)
    }

    const originTile = map[origin.y][origin.x];
    const destinationTile = map[destination.y][destination.x];
    if (originTile != TileType.PLAYER_A && originTile != TileType.PLAYER_B) {
        return false; // origin is not a player tile
    }
    if (destinationTile != TileType.EMPTY) {
        return false; // destination is not an empty tile
    }

    return true; // any other case is legal
}

function applyMove(map: Map, origin: Position, destination: Position) {
    if (! isLegalMove(map, origin, destination)) {
        return; // cannot apply illegal move
    }

    let playerTile = map[origin.y][origin.x];
    if (! isCloning(origin, destination)) {
        // the bacteria is jumping, so its previous position is now empty
        map[origin.y][origin.x] = TileType.EMPTY;
    }

    map[destination.y][destination.x] = playerTile;
    for (let x = destination.x - 1 ; x <= (destination.x + 1) ; ++x) {
        for (let y = destination.y - 1 ; y <= (destination.y + 1) ; ++y) {
            let pos = {x, y}
            if (isAPositionOnMap(map, pos) && isAPlayerTile(map, pos)) {
                map[y][x] = playerTile;
            }
        }
    }
}

function canAPlayerStillPlay(map: Map, player: TileType.PLAYER_A|TileType.PLAYER_B): boolean {
    for (let y = 0 ; y < map.length ; ++y) {
        for (let x = 0 ; x < map[y].length ; ++x) {
            let tile = map[y][x];
            if (tile != player) {
                continue; // tile does not belong to the player
            }

            for (let moveX = x - 1 ; moveX <= (x + 1) ; ++moveX) {
                for (let moveY = y - 1 ; moveY <= (y + 1) ; ++moveY) {
                    if (isLegalMove(map, {x, y}, {x: moveX, y: moveY})) {
                        return true; // a legal move is found
                    }
                }
            }
        }
    }
    return false; // no legal move found
}

function scoreOfPlayer(map: Map, player: TileType.PLAYER_A|TileType.PLAYER_B): number {
    return map.reduce((sum, layer) => sum + layer.filter(tile => tile == player).length, 0);
}

function isGameFinished(map: Map) {
    return ! canAPlayerStillPlay(map, TileType.PLAYER_A) || ! canAPlayerStillPlay(map, TileType.PLAYER_B);
}

const map = [
    [TileType.EMPTY, TileType.EMPTY, TileType.EMPTY, TileType.EMPTY],
    [TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL],
    [TileType.EMPTY, TileType.PLAYER_A, TileType.EMPTY, TileType.EMPTY],
    [TileType.EMPTY, TileType.EMPTY, TileType.PLAYER_B, TileType.EMPTY],
    [TileType.WALL, TileType.WALL, TileType.WALL, TileType.WALL]
];

displayMap(map);
console.log('--');
console.log("Game finished ? ", isGameFinished(map));
console.log("Score", scoreOfPlayer(map, TileType.PLAYER_A), "-", scoreOfPlayer(map, TileType.PLAYER_B));
console.log('--');
applyMove(map, {x: 1, y: 2}, {x: 3, y: 2});
displayMap(map);
console.log("Game finished ? ", isGameFinished(map));
console.log("Score", scoreOfPlayer(map, TileType.PLAYER_A), "-", scoreOfPlayer(map, TileType.PLAYER_B));
