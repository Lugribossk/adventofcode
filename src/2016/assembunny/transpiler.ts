import * as fs from "fs";
import * as path from "path";
import * as prettier from "prettier";
import {Instruction} from "./core";
import {Copy, Decrement, Increment, JumpNotZero} from "./instructions";
import {parseProgram} from "./parser";

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
        const target = typeof instruction.y === "number" ? `${index + instruction.y}` : `${index} + ${instruction.y}`;
        if (typeof instruction.x === "number" && instruction.x !== 0) {
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
    return "throw new Error('Not supported')";
};

export const transpile = (program: Instruction[]): string => {
    const source = `
        const run = (a, b, c, d) => {
            let jump = 0;
            while (true) {
                switch (jump) {
                    ${program
                        .map((instruction, i) => {
                            return `
                            case ${i}:
                                ${transpileInstruction(instruction, i)}`;
                        })
                        .join("")}
                }
                break;
            }
            return {a: a, b: b, c: c, d: d};
        };
        module.exports = run;`;

    return prettier.format(source, {
        parser: "babylon",
        ...prettier.resolveConfig.sync(__dirname)
    });
};

export const transpileAndSave = (file: string): string => {
    const program = parseProgram(fs.readFileSync(file, "utf8"));
    const script = transpile(program);

    const filename = path.join(__dirname, `../../../target/${path.basename(file)}.js`);
    fs.writeFileSync(filename, script, "utf8");

    return filename;
};

export const transpileAndRun = (file: string, a = 0, b = 0, c = 0, d = 0) => {
    const name = transpileAndSave(file);
    const run = require(name);

    const start = Date.now();
    const finalRegisters = run(a, b, c, d);
    console.log(`Executed in ${Date.now() - start}ms.`);

    console.log("Done, final registers:", finalRegisters);
};
