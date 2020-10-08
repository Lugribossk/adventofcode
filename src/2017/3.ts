import fs from "fs";

type Coordinate = {
    x: number;
    y: number;
};

// See https://math.stackexchange.com/questions/1263541/how-do-i-find-the-coordinate-relationship-between-numbers-on-a-number-spiral/1263570
// and https://stackoverflow.com/questions/11550153/determine-position-of-number-in-a-grid-of-numbers-centered-around-0-and-increasi
const first = (n: number) => 4 * n * n - 4 * n + 1 + 1;

const cycle = (i: number) => Math.floor((Math.sqrt(i - 1) + 1) / 2);

const length = (n: number) => 8 * n;

const sector = (i: number) => Math.floor((4 * (i - first(cycle(i)))) / length(cycle(i)));

const coordinates = (n: number): Coordinate => {
    const c = cycle(n);
    const s = sector(n);
    const offset = n - first(c) - (s * length(c)) / 4;

    if (s === 0) {
        // right
        return {x: c, y: -c + offset + 1};
    } else if (s === 1) {
        // up
        return {x: c - offset - 1, y: c};
    } else if (s === 2) {
        // left
        return {x: -c, y: c - offset - 1};
    }
    // down
    return {x: -c + offset + 1, y: -c};
};

const manhattanDistance = (a: Coordinate, b: Coordinate) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const sumAdjacent = (n: number) => {
    const values = new Map([["0,0", 1]]);
    const getValue = (coord: Coordinate) => values.get(`${coord.x},${coord.y}`) || 0;
    const setValue = (coord: Coordinate, value: number) => values.set(`${coord.x},${coord.y}`, value);

    for (let i = 2; i <= n; i++) {
        const coord = coordinates(i);
        let value = 0;
        for (let x = coord.x - 1; x <= coord.x + 1; x++) {
            for (let y = coord.y - 1; y <= coord.y + 1; y++) {
                if (!(x === coord.x && y === coord.y)) {
                    value += getValue({x: x, y: y});
                }
            }
        }
        setValue(coord, value);
    }
    return getValue(coordinates(n));
};

const firstAbove = (n: number) => {
    let i = 2;
    let value = 0;
    while (value <= n) {
        value = sumAdjacent(i);
        i++;
    }
    return value;
};

console.log(manhattanDistance(coordinates(312051), {x: 0, y: 0}));

console.log(firstAbove(312051));
