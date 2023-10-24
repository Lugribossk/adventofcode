/* eslint-disable @typescript-eslint/naming-convention */
import {readInput} from "../utils";

const input = readInput(import.meta.url).split("\r\n");

const rock = 1;
const paper = 2;
const scissors = 3;

const loss = 0;
const draw = 3;
const win = 6;

const strategyOwnMove = new Map([
    ["A X", rock + draw],
    ["A Y", paper + win],
    ["A Z", scissors + loss],
    ["B X", rock + loss],
    ["B Y", paper + draw],
    ["B Z", scissors + win],
    ["C X", rock + win],
    ["C Y", paper + loss],
    ["C Z", scissors + draw]
]);

const strategyResult = new Map([
    ["A X", scissors + loss],
    ["A Y", rock + draw],
    ["A Z", paper + win],
    ["B X", rock + loss],
    ["B Y", paper + draw],
    ["B Z", scissors + win],
    ["C X", paper + loss],
    ["C Y", scissors + draw],
    ["C Z", rock + win]
]);

console.log(input.map(line => strategyOwnMove.get(line)!).reduce((p, c) => p + c, 0));

console.log(input.map(line => strategyResult.get(line)!).reduce((p, c) => p + c, 0));
