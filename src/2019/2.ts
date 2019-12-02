import fs from "fs";
import path from "path";
import {runProgram} from "./intcode";

const arrayToObject = <T>(array: T[]): {[key: number]: T} => {
    return array.reduce((acc: any, curr, i) => {
        acc[i] = curr;
        return acc;
    }, {});
};

const run = (initial: number[], noun: number, verb: number) => {
    const finalState = runProgram(arrayToObject(initial), noun, verb);
    return finalState.memory[0];
};

const find = (initial: number[], targetOutput: number) => {
    const memory = arrayToObject(initial);

    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            if (runProgram(memory, noun, verb).memory[0] === targetOutput) {
                return {noun: noun, verb: verb};
            }
        }
    }

    throw new Error("Target output not found for any combination of noun and verb.");
};

const input = fs
    .readFileSync(path.resolve(__dirname, "2.txt"), "utf8")
    .split(",")
    .map(v => parseInt(v));

console.log(run(input, 12, 2));

console.log(find(input, 19690720));
