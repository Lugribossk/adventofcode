import {runWithIo} from "./intcode/run";
import {readInput} from "../utils";

(async () => {
    const input = readInput(import.meta.url);

    console.log(await runWithIo(input, 1));

    console.log(await runWithIo(input, 5));
})();
