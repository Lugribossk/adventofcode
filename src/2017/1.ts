import {readInput} from "../utils";

const sum = (data: string, offset: (length: number) => number) => {
    return data
        .split("")
        .map(char => parseInt(char))
        .filter((num, i, nums) => num === nums[(i + offset(nums.length)) % nums.length])
        .reduce((prev, current) => prev + current, 0);
};

const input = readInput(__filename);

console.log(sum(input, () => 1));

console.log(sum(input, length => length / 2));
