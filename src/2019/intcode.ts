export type Memory = {[address: number]: number};

export type State = {
    readonly memory: Memory;
    readonly ip: number;
};

export type Operation = (state: State, ...parameters: number[]) => State;

const add: Operation = ({memory, ip}, a, b, c) => ({
    memory: {
        ...memory,
        [c]: memory[a] + memory[b]
    },
    ip: ip + 4
});

const multiply: Operation = ({memory, ip}, a, b, c) => ({
    memory: {
        ...memory,
        [c]: memory[a] * memory[b]
    },
    ip: ip + 4
});

const halt: Operation = ({memory}) => ({
    memory: memory,
    ip: -Infinity
});

const operations = new Map([
    [1, add],
    [2, multiply],
    [99, halt]
]);

export const runProgram = (memory: Memory, noun: number, verb: number) => {
    let state: State = {
        memory: {
            ...memory,
            [1]: noun,
            [2]: verb
        },
        ip: 0
    };

    while (state.ip >= 0 && state.ip < Object.keys(state.memory).length) {
        const opcode = state.memory[state.ip];
        if (!operations.has(opcode)) {
            throw new Error(`Unknown opcode ${opcode} at position ${state.ip} on ${state.memory}.`);
        }

        state = operations.get(opcode)!(
            state,
            state.memory[state.ip + 1],
            state.memory[state.ip + 2],
            state.memory[state.ip + 3]
        );
    }

    return state;
};
