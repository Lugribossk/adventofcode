import fs from "fs";
import path from "path";
import {performance} from "perf_hooks";
import {runProgram} from "./core";
import {parse} from "./parser";
import {transpile} from "./transpiler";
import {optimize} from "./optimizer";

const round = (n: number) => n.toFixed(3);

export const parseAndRun = (file: string, a = 0, b = 0, c = 0, d = 0) => {
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
    const run = require(jsModule);

    const start = performance.now();
    const finalRegisters = run(a, b, c, d);

    console.log(
        `Ran ${path.basename(file)} transpile in ${round(performance.now() - start)}ms, input:`,
        {a, b, c, d},
        "output:",
        finalRegisters
    );
};
