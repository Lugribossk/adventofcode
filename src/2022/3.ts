import {readInput} from "../utils";

const input = readInput(__filename)
    .split("\r\n")
    .map(line => line.split(""));

const getPriority = (item: string) => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(item) + 1;

const priorityByHalves = () => {
    return input
        .map(items => {
            const inFirstHalf = new Set(items.slice(0, items.length / 2));
            return items.slice(items.length / 2).find(item => inFirstHalf.has(item))!;
        })
        .map(getPriority)
        .reduce((p, c) => p + c, 0);
};

const priorityByThrees = () => {
    const out: string[] = [];
    for (let i = 2; i < input.length; i += 3) {
        const inGroup1 = new Set(input[i - 2]);
        const inGroup2 = new Set(input[i - 1]);
        out.push(input[i].find(item => inGroup1.has(item) && inGroup2.has(item))!);
    }
    return out.map(getPriority).reduce((p, c) => p + c, 0);
};

console.log(priorityByHalves());

console.log(priorityByThrees());
