import path from "path";
import {parseAndRun, transpileAndRun} from "./assembunny/run";

(async () => {
    const file = path.resolve(__dirname, "12.txt");

    parseAndRun(file);

    await transpileAndRun(file);

    parseAndRun(file, 0, 0, 1);

    await transpileAndRun(file, 0, 0, 1);
})();
