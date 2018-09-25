import {Constant, Register, Instruction, State} from "./core";

const getArgValue = (op: Constant | Register, state: State) => typeof op === "number" ? op : state.registers[op];

export class Copy implements Instruction {
    readonly x: Constant | Register;
    readonly y: Register;

    constructor(x: Constant | Register, y: Register) {
        this.x = x;
        this.y = y;
    }

    execute(state: State) {
        return {
            ...state,
            pc: state.pc + 1,
            registers: {
                ...state.registers,
                [this.y]: getArgValue(this.x, state)
            }
        }
    }
}

export class Increment implements Instruction {
    readonly x: Register;

    constructor(x: Register) {
        this.x = x;
    }

    execute(state: State) {
        return {
            ...state,
            pc: state.pc + 1,
            registers: {
                ...state.registers,
                [this.x]: getArgValue(this.x, state) + 1
            }
        }
    }
}

export class Decrement implements Instruction {
    readonly x: Register;

    constructor(x: Register) {
        this.x = x;
    }

    execute(state: State) {
        return {
            ...state,
            pc: state.pc + 1,
            registers: {
                ...state.registers,
                [this.x]: getArgValue(this.x, state) - 1
            }
        }
    }
}

export class JumpNotZero implements Instruction {
    readonly x: Constant | Register;
    readonly y: Constant | Register;

    constructor(x: Constant | Register, y: Constant | Register) {
        this.x = x;
        this.y = y;
    }

    execute(state: State) {
        return {
            ...state,
            pc: state.pc + (getArgValue(this.x, state) !== 0 ? getArgValue(this.y, state) : 1)
        }
    }
}

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

const toggleInstruction = (oldInst: Instruction) => {
    const {x, y} = oldInst;
    if (oldInst instanceof NoOp) {
        return oldInst.reverse;
    } else if (y !== undefined) {
        if (x === undefined) {
            throw new Error("Two-argument instruction missing first argument: " + oldInst);
        }
        if (oldInst instanceof JumpNotZero) {
            if (typeof y !== "number") {
                return new Copy(x, y);
            }
            return new NoOp(oldInst);
        }
        return new JumpNotZero(x, y);
    } else if (x !== undefined) {
        if (typeof x === "number") {
            return new NoOp(oldInst);
        }
        if (oldInst instanceof Increment) {
            return new Decrement(x)
        }
        return new Increment(x);
    }
    return new NoOp(oldInst);
};

export class Toggle implements Instruction {
    readonly x: Constant | Register;

    constructor(x: Constant | Register) {
        this.x = x;
    }

    execute(state: State) {
        const target = state.pc + getArgValue(this.x, state);
        if (target < 0 || target >= state.program.length) {
            return {
                ...state,
                pc: state.pc + 1
            }
        }
        const oldInst = state.program[target];

        const newProgram = state.program.slice(0);
        newProgram.splice(target, 1, toggleInstruction(oldInst));
        return {
            ...state,
            pc: state.pc + 1,
            program: newProgram
        }
    }
}


