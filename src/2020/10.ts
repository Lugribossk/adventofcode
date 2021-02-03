import {readInput} from "../utils";

const input = readInput(__filename)
    .split("\r\n")
    .map(line => parseInt(line))
    .sort((a, b) => a - b);

const getDiffs = (numbers: number[]) => {
    let num1 = 0;
    let num3 = 0;
    numbers.forEach((n, i) => {
        const diff = numbers[i + 1] - n;
        if (diff === 1) {
            num1++;
        }
        if (diff === 3) {
            num3++;
        }
    });
    return num1 * num3;
};

const choicesForGroup = (size: number) => {
    if (size === 1 || size === 2) {
        return 1;
    }
    if (size === 3) {
        return 2;
    }
    if (size === 4) {
        return 4;
    }
    if (size === 5) {
        return 7;
    }
    throw new Error();
};

const getGroups = (numbers: number[]) => {
    const groups: number[] = [];
    let start = 0;
    numbers.forEach((n, i) => {
        const diff = numbers[i + 1] - n;
        if (diff === 2) {
            throw new Error();
        }
        if (diff === 3) {
            groups.push(i - start + 1);
            start = i + 1;
        }
    });
    return groups.reduce((acc, curr) => acc * choicesForGroup(curr), 1);
};

const adapters = [0, ...input, input[input.length - 1] + 3];

console.log(getDiffs(adapters));

console.log(getGroups(adapters));
