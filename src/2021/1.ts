import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(v => parseInt(v));

const countIncreases = (reports: number[]) => {
    let count = 0;
    for (let i = 0; i < reports.length; i++) {
        if (reports[i - 1] && reports[i - 1] < reports[i]) {
            count++;
        }
    }
    return count;
};

const groupByThree = (reports: number[]) => {
    const out = [];
    for (let i = 2; i < reports.length; i++) {
        out.push(reports[i - 2] + reports[i - 1] + reports[i]);
    }
    return out;
};

console.log(countIncreases(input));

console.log(countIncreases(groupByThree(input)));
