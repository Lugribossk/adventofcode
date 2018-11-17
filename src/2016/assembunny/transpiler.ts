import * as prettier from "prettier";
import {Instruction, isConstant} from "./core";
import {Copy, Decrement, Increment, JumpNotZero, NoOp} from "./instructions";
import {Add, Multiply} from "./optimizer";

const jumpTargets = (instructions: ReadonlyArray<Instruction>): (i: number) => boolean => {
    const targets = new Set([0]);
    for (let i = 0; i < instructions.length; i++) {
        const instruction = instructions[i];
        if (instruction instanceof JumpNotZero) {
            if (isConstant(instruction.y)) {
                targets.add(i + instruction.y);
            } else {
                return () => true;
            }
        }
    }
    return (i: number) => targets.has(i);
};

const transpileInstruction = (instruction: Instruction, index: number): string => {
    if (instruction instanceof Copy) {
        return `${instruction.y} = ${instruction.x};`;
    }
    if (instruction instanceof Increment) {
        return `${instruction.x}++;`;
    }
    if (instruction instanceof Decrement) {
        return `${instruction.x}--;`;
    }
    if (instruction instanceof JumpNotZero) {
        const target = isConstant(instruction.y) ? `${index + instruction.y}` : `${index} + ${instruction.y}`;
        if (isConstant(instruction.x) && instruction.x !== 0) {
            return `
                jump = ${target};
                continue;`;
        }

        return `
            if (${instruction.x} !== 0) {
                jump = ${target};
                continue;
            }`;
    }
    if (instruction instanceof NoOp) {
        return "";
    }
    if (instruction instanceof Add) {
        return `${instruction.y} += ${instruction.x};`;
    }
    if (instruction instanceof Multiply) {
        return `${instruction.y} *= ${instruction.x};`;
    }
    throw new Error(`${instruction.constructor.name} not supported`);
};

/**
 * Transpile the specified program into equivalent Javascript code.
 */
export const transpile = (program: ReadonlyArray<Instruction>): string => {
    const isJumpTarget = jumpTargets(program);
    const source = `
        const run = (a, b, c, d) => {
            let jump = 0;
            while (true) {
                switch (jump) {
                    ${program
                        .map((instruction, i) => {
                            if (!isJumpTarget(i)) {
                                return transpileInstruction(instruction, i);
                            }
                            return `
                                case ${i}:
                                    ${transpileInstruction(instruction, i)}`;
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
