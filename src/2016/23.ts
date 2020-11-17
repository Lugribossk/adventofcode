import path from "path";
import {parseAndRun, transpileAndRun} from "./assembunny/run";

(async () => {
    const file = path.resolve(__dirname, "23.txt");

    parseAndRun(file, 7);

    await transpileAndRun(file, 7);

    parseAndRun(file, 12);

    await transpileAndRun(file, 12);
})();
