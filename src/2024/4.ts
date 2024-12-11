import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(line => line.split(""));

const countXmas = (grid: string[][]) => {
    const coord = (x: number, y: number) => (grid[y] ?? [])[x];
    const across = (x: number, y: number, target: readonly [string, string, string, string]) =>
        coord(x, y) === target[0] &&
        coord(x + 1, y) === target[1] &&
        coord(x + 2, y) === target[2] &&
        coord(x + 3, y) === target[3];
    const down = (x: number, y: number, target: readonly [string, string, string, string]) =>
        coord(x, y) === target[0] &&
        coord(x, y + 1) === target[1] &&
        coord(x, y + 2) === target[2] &&
        coord(x, y + 3) === target[3];
    const diagonal1 = (x: number, y: number, target: readonly [string, string, string, string]) =>
        coord(x, y) === target[0] &&
        coord(x + 1, y + 1) === target[1] &&
        coord(x + 2, y + 2) === target[2] &&
        coord(x + 3, y + 3) === target[3];
    const diagonal2 = (x: number, y: number, target: readonly [string, string, string, string]) =>
        coord(x, y) === target[0] &&
        coord(x - 1, y + 1) === target[1] &&
        coord(x - 2, y + 2) === target[2] &&
        coord(x - 3, y + 3) === target[3];

    const xmas = ["X", "M", "A", "S"] as const;
    const samx = ["S", "A", "M", "X"] as const;
    let count = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            count += [
                across(x, y, xmas),
                down(x, y, xmas),
                diagonal1(x, y, xmas),
                diagonal2(x, y, xmas),
                across(x, y, samx),
                down(x, y, samx),
                diagonal1(x, y, samx),
                diagonal2(x, y, samx)
            ].filter(n => n).length;
        }
    }

    return count;
};

const countMasX = (grid: string[][]) => {
    const coord = (x: number, y: number) => (grid[y] ?? [])[x];

    let count = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (coord(x, y) === "A") {
                if (coord(x - 1, y - 1) === "M") {
                    if (coord(x + 1, y - 1) === "M" && coord(x + 1, y + 1) === "S" && coord(x - 1, y + 1) === "S") {
                        count++;
                    }
                    if (coord(x - 1, y + 1) === "M" && coord(x + 1, y - 1) === "S" && coord(x + 1, y + 1) === "S") {
                        count++;
                    }
                }
                if (coord(x + 1, y + 1) === "M") {
                    if (coord(x + 1, y - 1) === "M" && coord(x - 1, y - 1) === "S" && coord(x - 1, y + 1) === "S") {
                        count++;
                    }
                    if (coord(x - 1, y + 1) === "M" && coord(x - 1, y - 1) === "S" && coord(x + 1, y - 1) === "S") {
                        count++;
                    }
                }
            }
        }
    }

    return count;
};

console.log(countXmas(input));

console.log(countMasX(input));
