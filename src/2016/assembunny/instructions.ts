import {Constant, Register, Instruction, State, isConstant, getArgValue} from "./core";

/**
 * 'cpy x y' copies x (either an integer or the value of a register) into register y.
 */
export class Copy implements Instruction {
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
                [this.y]: getArgValue(this.x, state)
            }
        };
    }
}

/**
 * 'inc x' increases the value of register x by one.
 */
export class Increment implements Instruction {
    readonly x: Register;

    constructor(x: Register) {
        this.x = x;
    }

    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + 1,
            registers: {
                ...state.registers,
                [this.x]: getArgValue(this.x, state) + 1
            }
        };
    }
}

/**
 * 'dec x' decreases the value of register x by one.
 */
export class Decrement implements Instruction {
    readonly x: Register;

    constructor(x: Register) {
        this.x = x;
    }

    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + 1,
            registers: {
                ...state.registers,
                [this.x]: getArgValue(this.x, state) - 1
            }
        };
    }
}

/**
 * 'jnz x y' jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.
 * The jnz instruction moves relative to itself: an offset of -1 would continue at the previous instruction, while an
 * offset of 2 would skip over the next instruction.
 */
export class JumpNotZero implements Instruction {
    readonly x: Constant | Register;
    readonly y: Constant | Register;

    constructor(x: Constant | Register, y: Constant | Register) {
        this.x = x;
        this.y = y;
    }

    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + (getArgValue(this.x, state) !== 0 ? getArgValue(this.y, state) : 1)
        };
    }
}

/**
 * Do nothing.
 */
export class NoOp implements Instruction {
    readonly reverse: Instruction;

    constructor(reverse?: Instruction) {
        this.reverse = reverse || this;
    }

    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + 1
        };
    }
}

export const toggleInstruction = (oldInst: Instruction): Instruction => {
    const {x, y} = oldInst;
    if (oldInst instanceof NoOp) {
        return oldInst.reverse;
    } else if (y !== undefined) {
        if (x === undefined) {
            throw new Error(`Two-argument instruction missing first argument: ${oldInst}`);
        }
        if (oldInst instanceof JumpNotZero) {
            if (!isConstant(y)) {
                return new Copy(x, y);
            }
            return new NoOp(oldInst);
        }
        return new JumpNotZero(x, y);
    } else if (x !== undefined) {
        if (isConstant(x)) {
            return new NoOp(oldInst);
        }
        if (oldInst instanceof Increment) {
            return new Decrement(x);
        }
        return new Increment(x);
    }
    return new NoOp(oldInst);
};

/**
 * 'tgl x' toggles the instruction x away (pointing at instructions like jnz does: positive means forward; negative means backward):
 * For one-argument instructions, inc becomes dec, and all other one-argument instructions become inc.
 * For two-argument instructions, jnz becomes cpy, and all other two-instructions become jnz.
 * The arguments of a toggled instruction are not affected.
 * If an attempt is made to toggle an instruction outside the program, nothing happens.
 * If toggling produces an invalid instruction (like cpy 1 2) and an attempt is later made to execute that instruction, skip it instead.
 * If tgl toggles itself (for example, if a is 0, tgl a would target itself and become inc a), the resulting instruction is not executed until the next time it is reached.
 */
export class Toggle implements Instruction {
    readonly x: Constant | Register;

    constructor(x: Constant | Register) {
        this.x = x;
    }

    execute(state: State): State {
        const target = state.pc + getArgValue(this.x, state);
        if (target < 0 || target >= state.program.length) {
            return {
                ...state,
                pc: state.pc + 1
            };
        }
        const oldInst = state.program[target];

        const newProgram = state.program.slice(0);
        newProgram.splice(target, 1, toggleInstruction(oldInst));
        return {
            ...state,
            pc: state.pc + 1,
            program: newProgram
        };
    }
}

/**
 * 'out x' transmits x (either an integer or the value of a register) as the next value for the clock signal.
 */
export class Output implements Instruction {
    readonly x: Constant | Register;

    constructor(x: Constant | Register) {
        this.x = x;
    }

    execute(state: State, output: (n: number) => void): State {
        output(getArgValue(this.x, state));
        return {
            ...state,
            pc: state.pc + 1
        };
    }
}
