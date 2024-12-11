import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(line => line.split(" ").map(n => parseInt(n, 10)));

const isIncreasing = (a: number, b: number) => b > a && b <= a + 3;
const isDecreasing = (a: number, b: number) => b < a && b >= a - 3;

const isReportSafe = (report: number[], skips: number): boolean => {
    let skipsUsed = 0;
    const isCorrect = report.some((l, i) => report[i - 2] < report[i - 1] && report[i - 1] < report[i])
        ? isIncreasing
        : isDecreasing;
    for (let i = 1; i < report.length; i++) {
        if (!isCorrect(report[i - 1], report[i])) {
            if (skipsUsed < skips) {
                skipsUsed++;
                return (
                    isReportSafe(report.toSpliced(i, 1), skips - skipsUsed) ||
                    isReportSafe(report.toSpliced(i - 1, 1), skips - skipsUsed)
                );
            }
            return false;
        }
    }
    return true;
};

const countSafe = (reports: number[][], skips = 0) => {
    return reports.filter(report => isReportSafe(report, skips)).length;
};

console.log(countSafe(input));

console.log(countSafe(input, 1));
