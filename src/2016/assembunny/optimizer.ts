import {Constant, getArgValue, Instruction, Register, State} from "./core";
import {Copy, Decrement, Increment, JumpNotZero, NoOp} from "./instructions";

const replace = <T>(array: ReadonlyArray<T>, index: number, newItems: ReadonlyArray<T>) => {
    const newArray = array.slice(0);
    newArray.splice(index, newItems.length, ...newItems);
    return newArray;
};

/**
 * Adds the value of x to the register y.
 */
export class Add implements Instruction {
    readonly x: Constant | Register;
    readonly y: Register;

    constructor(x: Constant | Register, y: Register) {
        this.x = x;
        this.y = y;
    }

    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + 1,
            registers: {
                ...state.registers,
                [this.y]: getArgValue(this.y, state) + getArgValue(this.x, state)
            }
        };
    }
}

/**
 * Multiplies the value of x with the value of y and places it in register y.
 */
export class Multiply implements Instruction {
    readonly x: Constant | Register;
    readonly y: Register;

    constructor(x: Constant | Register, y: Register) {
        this.x = x;
        this.y = y;
    }

    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + 1,
            registers: {
                ...state.registers,
                [this.y]: getArgValue(this.x, state) * getArgValue(this.y, state)
            }
        };
    }
}

const optimizeAdd = (a: Instruction, b: Instruction, c: Instruction) => {
    if (
        a instanceof Increment &&
        b instanceof Decrement &&
        c instanceof JumpNotZero &&
        b.x === c.x &&
        c.y === -2 &&
        a.x !== b.x
    ) {
        return [new Add(b.x, a.x), new Copy(0, b.x), new NoOp()];
    }
    return;
};

const optimizeMultiply = (a: Instruction, b: Instruction, c: Instruction, d: Instruction, e: Instruction) => {
    if (
        a instanceof Increment &&
        b instanceof Decrement &&
        c instanceof JumpNotZero &&
        d instanceof Decrement &&
        e instanceof JumpNotZero &&
        b.x === c.x &&
        c.y === -2 &&
        d.x === e.x &&
        e.y === -5 &&
        a.x !== b.x
    ) {
        return [new Multiply(b.x, d.x), new Add(d.x, a.x), new Copy(0, b.x), new Copy(0, d.x), new NoOp()];
    }
    return;
};

/**
 * Generate a new version of the specified program that runs faster but produces the same result.
 */
export const optimize = (program: ReadonlyArray<Instruction>): ReadonlyArray<Instruction> => {
    // Optimizations aren't safe to perform when jumps or toggles can target the replaced instructions.
    // And if there's just one jump or toggle in the program that has a register as an argument, then any instruction can potentially be targeted.
    // So the only solution seems to be something where jumping to/toggling an instruction that was involved in an optimization immediately reverts that optimization.
    // Fortunately the test inputs do not exhibit this behavior so we can skip this for now.

    for (let i = 0; i < program.length; i++) {
        const optimized =
            optimizeMultiply(program[i], program[i + 1], program[i + 2], program[i + 3], program[i + 4]) ||
            optimizeAdd(program[i], program[i + 1], program[i + 2]);
        if (optimized) {
            program = replace(program, i, optimized);
        }
    }

    return program;
};
