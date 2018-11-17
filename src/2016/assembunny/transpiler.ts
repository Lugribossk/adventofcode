import * as prettier from "prettier";
import {Instruction, isConstant} from "./core";
import {Copy, Decrement, Increment, JumpNotZero, NoOp, Output} from "./instructions";
import {Add, JumpZero, Multiply} from "./optimizer";

/**
 * Returns a function that determines whether an instruction is potentially the target for a jump.
 */
const jumpTargets = (program: ReadonlyArray<Instruction>): ((i: number) => boolean) => {
    // We need to "jump" to the first instruction to start the program, so 0 is always a target.
    const targets = new Set([0]);
    for (let i = 0; i < program.length; i++) {
        const inst = program[i];
        if (inst instanceof JumpNotZero || inst instanceof JumpZero) {
            if (isConstant(inst.y)) {
                targets.add(i + inst.y);
            } else {
                return () => true;
            }
        }
    }
    return (i: number) => targets.has(i);
};

const transpileInstruction = (inst: Instruction, index: number): string => {
    // TODO It's kinda inconsistent that each instruction has to be listed in here for transpilation,
    // while it is a method on each instruction type for in-memory running. They should either both be methods or both be like this?
    if (inst instanceof Copy) {
        return `${inst.y} = ${inst.x};`;
    }
    if (inst instanceof Increment) {
        return `${inst.x}++;`;
    }
    if (inst instanceof Decrement) {
        return `${inst.x}--;`;
    }
    if (inst instanceof JumpNotZero) {
        const target = isConstant(inst.y) ? `${index + inst.y}` : `${index} + ${inst.y}`;
        if (isConstant(inst.x) && inst.x !== 0) {
            return `
                jump = ${target};
                continue;`;
        }

        return `
            if (${inst.x} !== 0) {
                jump = ${target};
                continue;
            }`;
    }
    if (inst instanceof NoOp) {
        return "";
    }
    if (inst instanceof Output) {
        return `output(${inst.x});`;
    }
    if (inst instanceof Add) {
        return `${inst.y} += ${inst.x};`;
    }
    if (inst instanceof Multiply) {
        return `${inst.y} *= ${inst.x};`;
    }
    if (inst instanceof JumpZero) {
        const target = isConstant(inst.y) ? `${index + inst.y}` : `${index} + ${inst.y}`;
        return `
            if (${inst.x} === 0) {
                jump = ${target};
                continue;
            }`;
    }
    throw new Error(`${inst.constructor.name} not supported`);
};

/**
 * Transpile the specified program into equivalent Javascript code.
 */
export const transpile = (program: ReadonlyArray<Instruction>): string => {
    const isJumpTarget = jumpTargets(program);
    const source = `
        const run = (a = 0, b = 0, c = 0, d = 0, output = console.log) => {
            let jump = 0;
            while (true) {
                switch (jump) {
                    ${program
                        .map((inst, i) => {
                            if (!isJumpTarget(i)) {
                                return transpileInstruction(inst, i);
                            }
                            return `
                                case ${i}:
                                    ${transpileInstruction(inst, i)}`;
                        })
                        .join("")}
                     default:
                        return {a, b, c, d};
                }
            }
        };
        module.exports = run;`;

    return prettier.format(source, {
        parser: "babylon",
        ...prettier.resolveConfig.sync(__dirname)
    });
};
