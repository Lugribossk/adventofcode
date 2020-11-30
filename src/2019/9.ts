import {runWithIo} from "./intcode/run";
import {readInput} from "../utils";

(async () => {
    const input = readInput(__filename);

    console.log(await runWithIo(input, 1));

    console.log(await runWithIo(input, 2));
})();
