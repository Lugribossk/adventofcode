import fs from "fs";
import path from "path";
import {runWithIo} from "./intcode/run";

(async () => {
    const input = fs.readFileSync(path.resolve(__dirname, "9.txt"), "utf8");

    console.log(await runWithIo(input, 1));

    console.log(await runWithIo(input, 2));
})();
