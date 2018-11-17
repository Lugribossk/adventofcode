export type Constant = number;

export type Register = "a" | "b" | "c" | "d";

export type State = Readonly<{
    pc: number;
    registers: {readonly [key in Register]: number};
    program: ReadonlyArray<Instruction>;
}>;

export interface Instruction {
    x?: Constant | Register;
    y?: Constant | Register;
    execute(state: State): State;
}

export const runProgram = (initialState: State) => {
    let state = initialState;
    let count = 0;
    const start = Date.now();
    while (state.pc >= 0 && state.pc < state.program.length) {
        state = state.program[state.pc].execute(state);
        count++;
    }
    console.log(`Executed ${count} instructions in ${Date.now() - start}ms.`);
    return state;
};
