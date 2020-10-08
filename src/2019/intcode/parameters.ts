import type {ParameterMode, State} from "./core";

const position: ParameterMode = (state, parameterIndex) => {
    return state.memory[state.ip + parameterIndex];
};

const immediate: ParameterMode = (state, parameterIndex) => {
    return state.ip + parameterIndex;
};

const relative: ParameterMode = (state, parameterIndex) => {
    return state.memory[state.ip + parameterIndex] + state.relativeBase;
};

const parameterModes = new Map<number, ParameterMode>([
    [0, position],
    [1, immediate],
    [2, relative]
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
    return state.memory[mode(state, parameterIndex)] || 0;
};

export const getTarget = (state: State, parameterIndex: number) => {
    const mode = getParameterMode(state.memory[state.ip], parameterIndex);
    if (mode === immediate) {
        throw new Error("Target parameters should not be in immediate mode.");
    }
    return mode(state, parameterIndex);
};
