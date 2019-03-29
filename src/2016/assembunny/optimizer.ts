import {Constant, getArgValue, Instruction, isConstant, Register, State} from "./core";
import {Copy, Decrement, Increment, JumpNotZero, NoOp} from "./instructions";

const replace = <T>(array: readonly T[], index: number, newItems: readonly T[]) => {
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

/**
 * The opposite of JumpNotZero, jumps to an instruction y away but only if x **is** zero.
 */
export class JumpZero implements Instruction {
    readonly x: Constant | Register;
    readonly y: Constant | Register;

    constructor(x: Constant | Register, y: Constant | Register) {
        this.x = x;
        this.y = y;
    }

    execute(state: State) {
        return {
            ...state,
            pc: state.pc + (getArgValue(this.x, state) === 0 ? getArgValue(this.y, state) : 1)
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

const optimizeJumpZero = (a: Instruction, b: Instruction) => {
    if (a instanceof JumpNotZero && b instanceof JumpNotZero && a.y === 2 && isConstant(b.x) && b.x !== 0) {
        return [new NoOp(), new JumpZero(a.x, b.y)];
    }
    return;
};

const optimizeNeverJump = (a: Instruction) => {
    if (a instanceof JumpNotZero && isConstant(a.x) && a.x === 0) {
        return [new NoOp()];
    }
    return;
};

/**
 * Generate a new version of the specified program that runs faster but produces the same result.
 * Might produce a broken program if the input is overly fond of dynamic jumps and toggles.
 */
export const optimize = (program: readonly Instruction[]): readonly Instruction[] => {
    // TODO Optimizations aren't safe to perform when jumps or toggles can target the replaced instructions.
    // And if there's just one jump or toggle in the program that has a register as an argument, then any instruction can potentially be targeted.
    // So the only solution seems to be something where jumping to/toggling an instruction that was involved in an optimization immediately reverts that optimization.
    // Fortunately the dynamism in the test programs does not interfere with any of the current optimizations so we can skip this for now.

    const optimizations = [optimizeMultiply, optimizeAdd, optimizeJumpZero, optimizeNeverJump];

    for (let i = 0; i < program.length; i++) {
        const optimized = optimizations.reduce(
            (prev: Instruction[] | undefined, current: (...args: Instruction[]) => Instruction[] | undefined) =>
                prev || current(...program.slice(i)),
            undefined
        );

        if (optimized) {
            program = replace(program, i, optimized);
        }
    }

    return program;
};
