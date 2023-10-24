import {readInput} from "../utils";

type SetOperation = <T>(a: Set<T>, b: Set<T>) => Set<T>;

const union: SetOperation = (a, b) => new Set([...a].concat([...b]));

const intersection: SetOperation = (a, b) => new Set([...a].filter(item => b.has(item)));

const input = readInput(import.meta.url)
    .split("\r\n\r\n")
    .map(group => {
        return group.split("\r\n").map(line => {
            return new Set(line.split(""));
        });
    });

const summarizeGroups = (operation: SetOperation) => {
    return input
        .map(group => {
            return group.reduce(operation, group[0]);
        })
        .reduce((acc, curr) => acc + curr.size, 0);
};

console.log(summarizeGroups(union));

console.log(summarizeGroups(intersection));
