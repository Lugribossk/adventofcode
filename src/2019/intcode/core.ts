export type Memory = Record<number, number>;

export type State = {
    readonly memory: Memory;
    readonly ip: number;
    readonly relativeBase: number;
};

export type IO = {
    input(): number | Promise<number>;
    output(out: number, finished: boolean): void;
};

export type Operation = (state: State, context: IO) => State | Promise<State>;

export type ParameterMode = (state: State, parameterIndex: number) => number;

export const HALT = 99;
