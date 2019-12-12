import fs from "fs";
import path from "path";
import {parse, runProgram} from "./intcode/run";
import {Memory} from "./intcode/core";

const permutations = <T>(items: T[]): T[][] => {
    if (items.length === 0) {
        return [[]];
    }
    return items.flatMap(item => {
        return permutations(items.filter(i => i !== item)).map(perm => [item].concat(perm));
    });
};

const runAmplifier = (memory: Memory, phase: number, input: number): number => {
    let firstInput = true;
    let output: number;

    runProgram(memory, {
        input() {
            if (firstInput) {
                firstInput = false;
                return phase;
            }
            return input;
        },
        output(out, finished) {
            output = out;
        }
    });

    return output!;
};

const maxSignal = (program: string) => {
    const memory = parse(program);
    let max = -Infinity;

    permutations([0, 1, 2, 3, 4]).forEach(phases => {
        let signal = 0;
        phases.forEach(phase => {
            signal = runAmplifier(memory, phase, signal);
        });

        if (signal > max) {
            max = signal;
        }
    });

    return max;
};

const input = fs.readFileSync(path.resolve(__dirname, "7.txt"), "utf8");

console.log(maxSignal(input));
