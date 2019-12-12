export type Memory = {readonly [address: number]: number};

export type State = {
    readonly memory: Memory;
    readonly ip: number;
};

export type IO = {
    input(): number;
    output(out: number, finished: boolean): void;
};

export type Operation = (state: State, context: IO) => State;

export type ParameterMode = (state: State, parameterIndex: number) => number;

export const HALT = 99;
