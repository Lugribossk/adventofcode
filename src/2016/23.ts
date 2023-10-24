import {parseAndRun, transpileAndRun} from "./assembunny/run";

(async () => {
    const file = `${import.meta.url.slice(8, -3)}.txt`;

    parseAndRun(file, 7);

    await transpileAndRun(file, 7);

    parseAndRun(file, 12);

    await transpileAndRun(file, 12);
})();
