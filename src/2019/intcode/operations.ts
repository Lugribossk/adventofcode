import type {Operation} from "./core";
import {HALT} from "./core";
import {getTarget, getValue} from "./parameters";

const add: Operation = state => {
    return {
        ...state,
        memory: {
            ...state.memory,
            [getTarget(state, 3)]: getValue(state, 1) + getValue(state, 2)
        },
        ip: state.ip + 4
    };
};

const multiply: Operation = state => ({
    ...state,
    memory: {
        ...state.memory,
        [getTarget(state, 3)]: getValue(state, 1) * getValue(state, 2)
    },
    ip: state.ip + 4
});

const read: Operation = async (state, io) => ({
    ...state,
    memory: {
        ...state.memory,
        [getTarget(state, 1)]: await io.input()
    },
    ip: state.ip + 2
});

const write: Operation = (state, io) => {
    io.output(getValue(state, 1), state.memory[state.ip + 2] === HALT);
    return {
        ...state,
        ip: state.ip + 2
    };
};

const jumpIfTrue: Operation = state => ({
    ...state,
    ip: getValue(state, 1) !== 0 ? getValue(state, 2) : state.ip + 3
});

const jumpIfFalse: Operation = state => ({
    ...state,
    ip: getValue(state, 1) === 0 ? getValue(state, 2) : state.ip + 3
});

const lessThan: Operation = state => ({
    ...state,
    memory: {
        ...state.memory,
        [getTarget(state, 3)]: getValue(state, 1) < getValue(state, 2) ? 1 : 0
    },
    ip: state.ip + 4
});

const equals: Operation = state => ({
    ...state,
    memory: {
        ...state.memory,
        [getTarget(state, 3)]: getValue(state, 1) === getValue(state, 2) ? 1 : 0
    },
    ip: state.ip + 4
});

const adjustRelativeBase: Operation = state => ({
    ...state,
    ip: state.ip + 2,
    relativeBase: state.relativeBase + getValue(state, 1)
});

export const operations = new Map<number, Operation>([
    [1, add],
    [2, multiply],
    [3, read],
    [4, write],
    [5, jumpIfTrue],
    [6, jumpIfFalse],
    [7, lessThan],
    [8, equals],
    [9, adjustRelativeBase]
]);
