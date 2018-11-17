/**
 * "Assembunny" assembly-like language
 * See https://adventofcode.com/2016/day/12 and https://adventofcode.com/2016/day/23
 */

export type Constant = number;

export type Register = "a" | "b" | "c" | "d";

export interface Instruction {
    x?: Constant | Register;
    y?: Constant | Register;
    execute(state: State, output: (n: number) => void): State;
}

export type State = Readonly<{
    pc: number;
    registers: {readonly [key in Register]: number};
    program: ReadonlyArray<Instruction>;
}>;

export const isConstant = (arg: Constant | Register): arg is Constant => typeof arg === "number";

export const getArgValue = (arg: Constant | Register, state: State) => (isConstant(arg) ? arg : state.registers[arg]);

export const runProgram = (program: ReadonlyArray<Instruction>, a = 0, b = 0, c = 0, d = 0, output = console.log) => {
    let state: State = {
        pc: 0,
        registers: {
            a: a,
            b: b,
            c: c,
            d: d
        },
        program: program
    };
    while (state.pc >= 0 && state.pc < state.program.length) {
        state = state.program[state.pc].execute(state, output);
    }
    return state;
};
