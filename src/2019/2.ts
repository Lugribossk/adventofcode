import fs from "fs";
import path from "path";
import {parse, runProgram} from "./intcode/run";

const run = (program: string, noun: number, verb: number) => {
    const parsed = parse(program);
    const initialMemory = {
        ...parsed,
        [1]: noun,
        [2]: verb
    };
    const finalState = runProgram(initialMemory);
    return finalState.memory[0];
};

const find = (program: string, targetOutput: number) => {
    const initialMemory = parse(program);

    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            const memory = {
                ...initialMemory,
                [1]: noun,
                [2]: verb
            };
            if (runProgram(memory).memory[0] === targetOutput) {
                return {noun: noun, verb: verb};
            }
        }
    }

    throw new Error("Target output not found for any combination of noun and verb.");
};

const input = fs.readFileSync(path.resolve(__dirname, "2.txt"), "utf8");

console.log(run(input, 12, 2));

console.log(find(input, 19690720));