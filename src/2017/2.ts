import {readInput} from "../utils";

const largestDifference = (line: number[]) => {
    const min = line.reduce((prev, curr) => (curr < prev ? curr : prev), Infinity);
    const max = line.reduce((prev, curr) => (curr > prev ? curr : prev), -Infinity);
    return max - min;
};

const evenlyDivisible = (line: number[]) => {
    let out = 0;
    line.forEach(n => {
        line.forEach(other => {
            const high = Math.max(n, other);
            const low = Math.min(n, other);
            if (high % low === 0 && high !== low) {
                out = high / low;
            }
        });
    });
    return out;
};

const run = (content: string, method: (line: number[]) => number) => {
    const spreadsheet = content.split("\r\n").map(line => line.split("\t").map(n => parseInt(n)));

    const checksum = spreadsheet.map(method).reduce((prev, curr) => prev + curr, 0);
    console.log(checksum);
};

const input = readInput(__filename);

run(input, largestDifference);

run(input, evenlyDivisible);
