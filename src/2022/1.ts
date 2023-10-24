import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split("\r\n\r\n")
    .map(lines => lines.split("\r\n").map(line => parseInt(line)))
    .map(nums => nums.reduce((p, c) => p + c, 0))
    .sort((a, b) => b - a);

console.log(input[0]);

console.log(input[0] + input[1] + input[2]);
