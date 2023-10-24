import {parseAndRun, transpileAndRun} from "./assembunny/run";

(async () => {
    const file = `${import.meta.url.slice(8, -3)}.txt`;

    parseAndRun(file);

    await transpileAndRun(file);

    parseAndRun(file, 0, 0, 1);

    await transpileAndRun(file, 0, 0, 1);
})();
