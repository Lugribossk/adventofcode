import prettier from "prettier";
import {Instruction, isConstant} from "./core";
import {Copy, Decrement, Increment, JumpNotZero, NoOp, Output, Toggle, toggleInstruction} from "./instructions";
import {Add, JumpZero, Multiply} from "./optimizer";

const getJumpTargets = (program: readonly Instruction[]): Set<number> => {
    // We need to "jump" to the first instruction to start the program, so 0 is always a target.
    const targets = new Set([0]);
    program.forEach((inst, i) => {
        if (inst instanceof JumpNotZero || inst instanceof JumpZero) {
            if (isConstant(inst.y)) {
                targets.add(i + inst.y);
            } else {
                for (let j = 0; j < program.length; j++) {
                    targets.add(j);
                }
            }
        }
    });
    return targets;
};

const getToggleTargets = (program: readonly Instruction[]): Set<number> => {
    const targets: Set<number> = new Set();
    program.forEach((inst, i) => {
        if (inst instanceof Toggle) {
            if (isConstant(inst.x)) {
                targets.add(i + inst.x);
            } else {
                for (let j = 0; j < program.length; j++) {
                    targets.add(j);
                }
            }
        }
    });
    return targets;
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
    if (inst instanceof Toggle) {
        return `
            if (toggled.has(${index} + ${inst.x})) {
                toggled.delete(${index} + ${inst.x});
            } else {
                toggled.add(${index} + ${inst.x});
            }`;
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
export const transpile = (program: readonly Instruction[]): string => {
    const jumpTargets = getJumpTargets(program);
    const toggleTargets = getToggleTargets(program);

    // We can use a switch statement to simulate jumping to arbitrary instructions.
    // The default case is used to handle the "jumping outside the program halts it" behavior so we don't have to check that in each jump instruction.
    // Continue'ing to labels would not work as the target can change at runtime based on the content of a register.

    const source = `
        const run = (a = 0, b = 0, c = 0, d = 0, output = console.log) => {
            const toggled = new Set();
            let jump = 0;
            while (true) {
                switch (jump) {
                    ${program
                        .map((inst, i) => {
                            let out = transpileInstruction(inst, i);
                            if (toggleTargets.has(i)) {
                                out = `
                                if (!toggled.has(${i})) {
                                    ${out}
                                } else {
                                    ${transpileInstruction(toggleInstruction(inst), i)}
                                }`;
                            }
                            if (jumpTargets.has(i)) {
                                out = `
                                    case ${i}:
                                        ${out}`;
                            }
                            return out;
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
