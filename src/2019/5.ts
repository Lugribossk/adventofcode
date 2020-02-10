import fs from "fs";
import path from "path";
import {parse, runProgram} from "./intcode/run";

const run = async (program: string, id: number) => {
    const initialMemory = parse(program);
    let output;
    await runProgram(initialMemory, {
        input() {
            return id;
        },
        output(out, finished) {
            if (finished) {
                output = out;
            } else if (out !== 0) {
                throw new Error("Unexpected non-zero output.");
            }
        }
    });
    return output;
};

(async () => {
    const input = fs.readFileSync(path.resolve(__dirname, "5.txt"), "utf8");

    console.log(await run(input, 1));

    console.log(await run(input, 5));
})();
