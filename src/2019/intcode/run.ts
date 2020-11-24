import {IO, HALT, Memory, State} from "./core";
import {operations} from "./operations";

const getOpcode = (value: number) => {
    return parseInt(value.toString().slice(-2));
};

export const parse = (input: string): Memory => {
    return input
        .split(",")
        .map(v => parseInt(v))
        .reduce((acc: Record<string, number>, curr, i) => {
            acc[i] = curr;
            return acc;
        }, {});
};

export const runProgram = async (
    initialMemory: Memory,
    io: IO = {
        input() {
            throw new Error("input() must be implemented for programs that read.");
        },
        output() {
            throw new Error("output() must be implemented for programs that write.");
        }
    }
): Promise<State> => {
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
