import {readInput} from "../utils";

const sum = (data: number[], offset: (length: number) => number) => {
    return data
        .filter((num, i, nums) => num === nums[(i + offset(nums.length)) % nums.length])
        .reduce((prev, current) => prev + current, 0);
};

const input = readInput(import.meta.url)
    .split("")
    .map(char => parseInt(char));

console.log(sum(input, () => 1));

console.log(sum(input, length => length / 2));
