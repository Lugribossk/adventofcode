import * as fs from "fs";
import * as path from "path";
import {performance} from "perf_hooks";
import {runProgram} from "./core";
import {parse} from "./parser";
import {transpile} from "./transpiler";
import {optimize} from "./optimizer";

export const parseAndRun = (file: string, a = 0, b = 0, c = 0, d = 0) => {
    const program = parse(fs.readFileSync(file, "utf8"));
    const optimized = optimize(program);

    const start = performance.now();
    const finalState = runProgram({
        pc: 0,
        registers: {
            a: a,
            b: b,
            c: c,
            d: d
        },
        program: optimized
    });

    console.log(`Ran ${file} in ${performance.now() - start}ms, final registers:`, finalState.registers);
};

export const transpileAndSave = (file: string): string => {
    const program = parse(fs.readFileSync(file, "utf8"));
    const optimized = optimize(program);
    const script = transpile(optimized);

    const targetDir = path.join(__dirname, `../../../target`);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
    }

    const filename = path.join(targetDir, `${path.basename(file)}.js`);
    fs.writeFileSync(filename, script, "utf8");

    return filename;
};

export const transpileAndRun = (file: string, a = 0, b = 0, c = 0, d = 0) => {
    const jsModule = transpileAndSave(file);
    const run = require(jsModule);

    const start = performance.now();
    const finalRegisters = run(a, b, c, d);

    console.log(`Ran ${file} in ${performance.now() - start}ms, final registers:`, finalRegisters);
};
