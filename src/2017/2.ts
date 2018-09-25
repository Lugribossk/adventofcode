import * as path from "path";
import * as fs from "fs";

const largestDifference = (line: number[]) => {
    const min = line.reduce((prev, curr) => curr < prev ? curr : prev, Infinity);
    const max = line.reduce((prev, curr) => curr > prev ? curr : prev, -Infinity);
    return max - min;
};

const evenlyDivisible = (line: number[]) => {
    let out: number;
    line.forEach(n => {
        line.forEach(other => {
            const high = Math.max(n, other);
            const low = Math.min(n, other);
            if (high % low === 0 && high !== low) {
                out = high / low;
            }
        })
    });
    return out!;
};

const run = (file: string, method: (line: number[]) => number) => {
    const content = fs.readFileSync(file, "utf8");
    const spreadsheet = content.split("\r\n")
        .map(line => line.split("\t").map(n => parseInt(n)));

    const checksum = spreadsheet
        .map(method)
        .reduce((prev, curr) => prev + curr, 0);
    console.log(checksum);
};

run(path.resolve(__dirname, "2.txt"), largestDifference);

run(path.resolve(__dirname, "2.txt"), evenlyDivisible);