import {ParameterMode, State} from "./core";

const position: ParameterMode = (state, parameterIndex) => {
    return state.memory[state.memory[state.ip + parameterIndex]];
};

const immediate: ParameterMode = (state, parameterIndex) => {
    return state.memory[state.ip + parameterIndex];
};

const parameterModes = new Map<number, ParameterMode>([
    [0, position],
    [1, immediate]
]);

const getParameterMode = (value: number, parameterIndex: number): ParameterMode => {
    const modes = value
        .toString()
        .split("")
        .reverse()
        .slice(2)
        .map(n => parseInt(n));

    const mode = modes[parameterIndex - 1] || 0;
    if (!parameterModes.has(mode)) {
        throw new Error(`Unknown parameter mode ${mode} in ${value}.`);
    }

    return parameterModes.get(mode)!;
};

export const getValue = (state: State, parameterIndex: number) => {
    const mode = getParameterMode(state.memory[state.ip], parameterIndex);
    return mode(state, parameterIndex);
};

export const getTarget = (state: State, parameterIndex: number) => {
    return state.memory[state.ip + parameterIndex];
};
