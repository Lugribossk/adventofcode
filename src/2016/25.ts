import * as fs from "fs";
import * as path from "path";
import {performance} from "perf_hooks";
import {transpileAndSave} from "./assembunny/run";
import {parse} from "./assembunny/parser";
import {optimize} from "./assembunny/optimizer";
import {runProgram} from "./assembunny/core";

const findAlternatingSequence = (
    run: (a: number, b: number, c: number, d: number, output: (n: number) => void) => void
) => {
    // Try all sequences, proceeding to the next one as soon as the current one does not alternate correctly.
    // If the sequence alternates correctly for long enough (even a short run seems to be enough for the test data),
    // we assume it will do so forever.
    // Detecting if the program state is identical each time 0 is output, and each time 1 is output would let us
    // identify a valid sequence quickly. However it would also potentially reject valid sequences, e.g. one with an
    // unrelated variable that increases by one after each output.
    let a = 1;

    const start = performance.now();
    while (true) {
        try {
            let expect = 0;
            let num = 0;
            run(a, 0, 0, 0, n => {
                if (n !== expect) {
                    throw new Error("Sequence not valid");
                }
                expect = expect === 0 ? 1 : 0;
                num++;
                if (num === 1000) {
                    throw new Error("done");
                }
            });
        } catch (e) {
            if (e.message === "done") {
                break;
            }
            a++;
        }
    }

    console.log(`Ran in ${(performance.now() - start).toFixed(3)}ms, found alternating sequence for a =`, a);
};

const findWithRun = (file: string) => {
    const program = parse(fs.readFileSync(file, "utf8"));
    const optimized = optimize(program);

    findAlternatingSequence((a: number, b: number, c: number, d: number, output: (n: number) => void) => {
        runProgram(optimized, a, b, c, d, output);
    });
};

const findWithTranspile = (file: string) => {
    const jsModule = transpileAndSave(file);
    const run = require(jsModule);

    findAlternatingSequence(run);
};

const file = path.resolve(__dirname, "25.txt");

findWithRun(file);

findWithTranspile(file);
