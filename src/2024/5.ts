import {readInput} from "../utils";

const input = readInput(import.meta.url).split("\r\n\r\n\r\n");

const rules = input[0].split("\r\n").map(line => {
    const [before, after] = line.split("|");
    return {before: parseInt(before, 10), after: parseInt(after, 10)};
});

const updates = input[1].split("\r\n").map(line => line.split(",").map(n => parseInt(n, 10)));
