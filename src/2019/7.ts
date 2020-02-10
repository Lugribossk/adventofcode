import fs from "fs";
import path from "path";
import {parse, runProgram} from "./intcode/run";
import {Memory, State} from "./intcode/core";

const permutations = <T>(items: T[]): T[][] => {
    if (items.length === 0) {
        return [[]];
    }
    return items.flatMap(item => {
        return permutations(items.filter(i => i !== item)).map(perm => [item].concat(perm));
    });
};

const runAmplifier = async (memory: Memory, phase: number, input: number): Promise<number> => {
    let firstInput = true;
    let output: number;

    await runProgram(memory, {
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

const maxSignal = async (program: string) => {
    const memory = parse(program);
    let max = -Infinity;

    for (const phases of permutations([0, 1, 2, 3, 4])) {
        let signal = 0;

        for (const phase of phases) {
            signal = await runAmplifier(memory, phase, signal);
        }

        if (signal > max) {
            max = signal;
        }
    }

    return max;
};

class AsyncValue<T> {
    private val: T;
    private resolve: (v: T) => void;
    private promise!: Promise<T>;

    constructor(initial: T) {
        this.val = initial;
        this.resolve = () => {};
        this.value = initial;
    }

    get value(): T {
        return this.val;
    }

    set value(v: T) {
        this.val = v;
        const resolve = this.resolve;
        this.promise = new Promise(resolve => {
            this.resolve = resolve;
        });
        resolve(v);
    }

    async valueChanged(): Promise<T> {
        return this.promise;
    }
}

const runAmplifiersRepeatedly = async (memory: Memory, phases: number[]) => {
    const inputs: AsyncValue<number>[] = [];
    const programs: Promise<State>[] = [];

    for (let i = 0; i < 5; i++) {
        inputs[i] = new AsyncValue(0);
        programs[i] = runProgram(memory, {
            async input() {
                return inputs[i].valueChanged();
            },
            output(n) {
                inputs[(i + 1) % inputs.length].value = n;
            }
        });
    }

    inputs[0].value = 0;

    await Promise.all(programs);

    return inputs[0].value;
};

(async () => {
    const input = fs.readFileSync(path.resolve(__dirname, "7.txt"), "utf8");

    console.log(await maxSignal(input));
})();
