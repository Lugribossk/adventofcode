import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(line => parseInt(line));

const findNonSum = () => {
    for (let i = 25; i < input.length; i++) {
        const before = input.slice(i - 25, i);

        const valid = before.some(a => before.some(b => a !== b && a + b === input[i]));
        if (!valid) {
            return input[i];
        }
    }
    throw new Error();
};

const findContiguous = (target: number) => {
    for (let i = 0; i < input.length; i++) {
        let sum = 0;
        for (let j = 0; sum < target && j + i < input.length; j++) {
            sum = sum + input[i + j];
            if (sum === target && j > 0) {
                const range = input.slice(i, i + j).sort((a, b) => a - b);
                return range[0] + range[range.length - 1];
            }
        }
    }
    throw new Error();
};

console.log(findNonSum());

console.log(findContiguous(findNonSum()));
