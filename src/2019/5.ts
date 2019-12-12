import fs from "fs";
import path from "path";
import {parse, runProgram} from "./intcode/run";

const run = (program: string, id: number) => {
    const initialMemory = parse(program);
    runProgram(initialMemory, {
        input() {
            return id;
        },
        output(out, finished) {
            if (finished) {
                console.log(out);
            } else if (out !== 0) {
                throw new Error("Unexpected non-zero output.");
            }
        }
    });
};

const input = fs.readFileSync(path.resolve(__dirname, "5.txt"), "utf8");

run(input, 1);

run(input, 5);
