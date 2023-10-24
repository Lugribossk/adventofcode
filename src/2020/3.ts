import {readInput} from "../utils";

type Position = "." | "#";

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(line => line.split("")) as Position[][];

const getPosition = (right: number, down: number): Position => {
    if (down >= input.length) {
        throw new Error("Out of bounds");
    }
    if (right >= input[0].length) {
        right = right % input[0].length;
    }
    return input[down][right];
};

const getSlopePositions = (dRight: number, dDown: number) => {
    let right = 0;
    let down = 0;
    const positions: Position[] = [];
    while (down < input.length) {
        positions.push(getPosition(right, down));
        right += dRight;
        down += dDown;
    }
    return positions;
};

const getNumTrees = (dRight: number, dDown: number) => {
    return getSlopePositions(dRight, dDown).filter(p => p === "#").length;
};

console.log(getNumTrees(3, 1));

console.log(getNumTrees(1, 1) * getNumTrees(3, 1) * getNumTrees(5, 1) * getNumTrees(7, 1) * getNumTrees(1, 2));
