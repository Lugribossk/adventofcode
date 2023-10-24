import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split(",")
    .map(n => parseInt(n));

const anyMedian = (n: number[]) => {
    return n.slice().sort((a, b) => a - b)[Math.floor(n.length / 2)];
};

const getCost = (target: number, diff: (n: number) => number) => {
    return input.reduce((p, c) => p + diff(Math.abs(c - target)), 0);
};

const triangular = (n: number) => (n * (n + 1)) / 2;

const findLowestCost = (diff: (n: number) => number) => {
    let cost = Infinity;
    for (let target = 0; target < Math.max(...input); target++) {
        const newCost = getCost(target, diff);
        if (newCost > cost) {
            return cost;
        }
        cost = newCost;
    }
    throw new Error();
};

console.log(getCost(anyMedian(input), n => n));

console.log(findLowestCost(triangular));
