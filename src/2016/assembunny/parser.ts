import {Constant, Register, Instruction} from "./core";
import {Copy, Decrement, Increment, JumpNotZero, Output, Toggle} from "./instructions";

const parseConstant = (input?: string): Constant => {
    if (!input) {
        throw new Error("Missing required constant");
    }
    const maybe = parseInt(input);
    if (!Number.isNaN(maybe)) {
        return maybe;
    }
    throw new Error(`Not a constant: '${input}'`);
};

const parseRegister = (input?: string): Register => {
    if (!input) {
        throw new Error("Missing required register");
    }
    if (input === "a" || input === "b" || input === "c" || input === "d") {
        return input;
    }
    throw new Error(`Not a register: '${input}'`);
};

const parseConstantOrRegister = (input?: string): Constant | Register => {
    if (!input) {
        throw new Error("Missing required constant or register");
    }
    if (input === "a" || input === "b" || input === "c" || input === "d") {
        return input;
    }
    const maybe = parseInt(input);
    if (!Number.isNaN(maybe)) {
        return maybe;
    }
    throw new Error(`Not a constant or register: '${input}'`);
};

const parseCopy = (inst?: string, x?: string, y?: string): Instruction | undefined => {
    if (inst === "cpy") {
        return new Copy(parseConstantOrRegister(x), parseRegister(y));
    }
    return;
};

const parseIncrement = (inst?: string, x?: string) => {
    if (inst === "inc") {
        return new Increment(parseRegister(x));
    }
    return;
};

const parseDecrement = (inst?: string, x?: string) => {
    if (inst === "dec") {
        return new Decrement(parseRegister(x));
    }
    return;
};

const parseJumpNotZero = (inst?: string, x?: string, y?: string) => {
    if (inst === "jnz") {
        return new JumpNotZero(parseConstantOrRegister(x), parseConstantOrRegister(y));
    }
    return;
};

const parseToggle = (inst?: string, x?: string) => {
    if (inst === "tgl") {
        return new Toggle(parseConstantOrRegister(x));
    }
    return;
};

const parseOutput = (inst?: string, x?: string) => {
    if (inst === "out") {
        return new Output(parseConstantOrRegister(x));
    }
    return;
};

/**
 * Parse the text representation of a program into an abstract syntax object representation.
 */
export const parse = (input: string): ReadonlyArray<Instruction> => {
    const instParsers = [parseCopy, parseIncrement, parseDecrement, parseJumpNotZero, parseToggle, parseOutput];

    return input.split("\r\n").map((line, i) => {
        try {
            const [inst, x, y] = line.split(" ");
            const possibleInst = instParsers.reduce(
                (
                    prev: Instruction | undefined,
                    current: (inst?: string, x?: string, y?: string) => Instruction | undefined
                ) => prev || current(inst, x, y),
                undefined
            );
            if (!possibleInst) {
                throw new Error(`Unknown instruction: ${inst}`);
            }
            return possibleInst;
        } catch (e) {
            throw new Error(`Parse error on line ${i}: ${e.message}`);
        }
    });
};
