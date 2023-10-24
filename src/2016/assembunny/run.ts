import fs from "node:fs";
import path from "node:path";
import {performance} from "node:perf_hooks";
import type {State} from "./core";
import {runProgram} from "./core";
import {parse} from "./parser";
import {transpile} from "./transpiler";
import {optimize} from "./optimizer";

export type TranspiledRunFunction = (
    a: number,
    b: number,
    c: number,
    d: number,
    output?: (n: number) => void
) => State["registers"];

const round = (n: number) => n.toFixed(3);

export const parseAndRun = (file: string, a = 0, b = 0, c = 0, d = 0): void => {
    const program = parse(fs.readFileSync(file, "utf8"));
    const optimized = optimize(program);

    const start = performance.now();
    const finalState = runProgram(optimized, a, b, c, d);

    console.log(
        `Ran ${path.basename(file)} in-memory in ${round(performance.now() - start)}ms, input:`,
        {a, b, c, d},
        "output:",
        finalState.registers
    );
};

export const transpileAndSave = async (file: string): Promise<string> => {
    const program = parse(fs.readFileSync(file, "utf8"));
    const optimized = optimize(program);
    const script = await transpile(optimized);

    const targetDir = path.join(import.meta.url.slice(8), `../../../../target/transpiled`);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    const filename = path.join(targetDir, `${path.basename(file)}.js`);
    fs.writeFileSync(filename, script, "utf8");

    return filename;
};

export const transpileAndRun = async (file: string, a = 0, b = 0, c = 0, d = 0): Promise<void> => {
    const jsModule = await transpileAndSave(file);
    const {default: run} = (await import(`file://${jsModule}`)) as {default: TranspiledRunFunction};

    const start = performance.now();
    const finalRegisters = run(a, b, c, d);

    console.log(
        `Ran ${path.basename(file)} transpile in ${round(performance.now() - start)}ms, input:`,
        {a, b, c, d},
        "output:",
        finalRegisters
    );
};
