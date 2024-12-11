import {readInput} from "../utils";

const START = "^";
const OBSTRUCTION = "#";
const OPEN = ".";

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(line => line.split(""));

const countVisited = (grid: string[][]) => {
    let direction = "up";
    let y = grid.findIndex(row => row.includes(START));
    let x = grid[y].findIndex(n => n === START);
    const visited = new Set<string>();
    const visitedWithDirection = new Set<string>();

    while (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
        const nextX = direction === "left" ? x - 1 : direction === "right" ? x + 1 : x;
        const nextY = direction === "up" ? y - 1 : direction === "down" ? y + 1 : y;

        if ((grid[nextY] ?? [])[nextX] === OBSTRUCTION) {
            direction =
                direction === "up" ? "right" : direction === "right" ? "down" : direction === "down" ? "left" : "up";
        } else {
            x = nextX;
            y = nextY;
        }

        if (visitedWithDirection.has(`${x},${y},${direction}`)) {
            return [visited.size, true];
        }
        visited.add(`${x},${y}`);
        visitedWithDirection.add(`${x},${y},${direction}`);
    }

    return [visited.size, false];
};

const countLoopObstructions = (grid: string[][]) => {
    let count = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const modified = grid.slice();
            modified[y] = modified[y].slice();

            if (modified[y][x] !== OPEN) {
                continue;
            }
            modified[y][x] = "#";
            const [, loop] = countVisited(modified);
            if (loop) {
                count++;
            }
        }
    }

    return count;
};

console.log(countVisited(input)[0]);

console.log(countLoopObstructions(input));
