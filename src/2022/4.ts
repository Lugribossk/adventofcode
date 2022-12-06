import {readInput} from "../utils";

const input = readInput(__filename)
    .split("\r\n")
    .map(line => {
        const match = /(\d+)-(\d+),(\d+)-(\d+)/.exec(line);
        if (!match) {
            throw new Error(`Unable to parse '${line}'`);
        }
        return [
            {
                from: parseInt(match[1]),
                to: parseInt(match[2])
            },
            {
                from: parseInt(match[3]),
                to: parseInt(match[4])
            }
        ];
    });

console.log(input.filter(([a, b]) => (a.from >= b.from && a.to <= b.to) || (b.from >= a.from && b.to <= a.to)).length);

console.log(
    input.filter(([a, b]) => (a.from >= b.from && a.from <= b.to) || (b.from >= a.from && b.from <= a.to)).length
);
