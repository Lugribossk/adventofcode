import type {IO, Memory, State} from "./core";
import {HALT} from "./core";
import {operations} from "./operations";

const getOpcode = (value: number) => {
    return parseInt(value.toString().slice(-2));
};

export const parse = (input: string): Memory => {
    return Object.fromEntries(
        input
            .split(",")
            .map(v => parseInt(v))
            .entries()
    );
};

const defaultIo = {
    input() {
        throw new Error("input() must be implemented for programs that read.");
    },
    output() {
        throw new Error("output() must be implemented for programs that write.");
    }
};

export const runProgram = async (initialMemory: Memory, io: IO = defaultIo): Promise<State> => {
    let state: State = {
        memory: initialMemory,
        ip: 0,
        relativeBase: 0
    };

    while (state.memory[state.ip] !== HALT) {
        const value = state.memory[state.ip];
        if (value === undefined) {
            throw new Error(`Invalid instruction pointer ${state.ip} on ${state.memory}.`);
        }

        const opcode = getOpcode(value);
        if (!operations.has(opcode)) {
            throw new Error(`Unknown opcode ${opcode} at position ${state.ip} on ${state.memory}.`);
        }

        state = await operations.get(opcode)!(state, io);
    }

    return state;
};

export const runWithIo = async (program: string, input: number): Promise<number> => {
    const initialMemory = parse(program);

    return new Promise(resolve => {
        runProgram(initialMemory, {
            input() {
                return input;
            },
            output(out, finished) {
                if (finished) {
                    resolve(out);
                } else if (out !== 0) {
                    throw new Error("Unexpected non-zero output.");
                }
            }
        });
    });
};
