import {readInput} from "../utils";

const sum = (numbers: number[]) => numbers.reduce((prev, curr) => prev + curr, 0);

const firstTwice = (numbers: number[]) => {
    const sums = new Set<number>([0]);

    let sum = 0;
    for (let i = 0; true; i = (i + 1) % numbers.length) {
        sum += numbers[i];
        if (sums.has(sum)) {
            return sum;
        }
        sums.add(sum);
    }
};

const input = readInput(__filename)
    .split("\r\n")
    .map(n => parseInt(n));

console.log(sum(input));

console.log(firstTwice(input));
