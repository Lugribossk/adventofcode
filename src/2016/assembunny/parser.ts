import {Constant, Register, Instruction, runProgram} from "./core";
import {Copy, Decrement, Increment, JumpNotZero, Toggle} from "./instructions";
import * as fs from "fs";

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
    throw new Error("Not a register: '" + input + "'");
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
    return undefined;
};

const parseIncrement = (inst?: string, x?: string) => {
    if (inst === "inc") {
        return new Increment(parseRegister(x));
    }
    return undefined;
};

const parseDecrement = (inst?: string, x?: string) => {
    if (inst === "dec") {
        return new Decrement(parseRegister(x));
    }
    return undefined;
};

const parseJumpNotZero = (inst?: string, x?: string, y?: string) => {
    if (inst === "jnz") {
        return new JumpNotZero(parseConstantOrRegister(x), parseConstantOrRegister(y));
    }
    return undefined;
};

const parseToggle = (inst?: string, x?: string) => {
    if (inst === "tgl") {
        return new Toggle(parseConstantOrRegister(x));
    }
    return undefined;
};

export const parseProgram = (input: string): Instruction[] => {
    return input.split("\r\n").map((line, i) => {
        try {
            const [inst, x, y] = line.split(" ");
            const possibleInst = [parseCopy, parseIncrement, parseDecrement, parseJumpNotZero, parseToggle].reduce(
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

export const parseAndRun = (file: string, a = 0, b = 0, c = 0, d = 0) => {
    const program = parseProgram(fs.readFileSync(file, "utf8"));
    console.log("Running program with", program.length, "instructions.");
    const finalState = runProgram({
        pc: 0,
        registers: {
            a: a,
            b: b,
            c: c,
            d: d
        },
        program: program
    });
    console.log("Done, final registers:", finalState.registers);
};
