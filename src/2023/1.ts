import {readInput} from "../utils";

const input = readInput(import.meta.url).split("\r\n");

const digitText = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
};

const getFirstDigit = (line: string) => {
    for (const [text, digit] of Object.entries(digitText)) {
        if (line.startsWith(text) || line.startsWith(digit.toString())) {
            return digit;
        }
    }

    return undefined;
};

const getFirstAndLastValue = (digits: number[][]) => {
    return digits.reduce((acc, curr) => curr[0] * 10 + curr.at(-1)! + acc, 0);
};

const numbers = (lines: string[]) => {
    const digits = lines.map(line =>
        line.split("").flatMap(n => {
            const digit = parseInt(n, 10);
            if (Number.isNaN(digit)) {
                return [];
            }
            return [digit];
        })
    );
    return getFirstAndLastValue(digits);
};

const numbersText = (lines: string[]) => {
    const digitLines = lines.map(line => {
        const digits: number[] = [];
        for (let i = 0; i < line.length; i++) {
            const digit = getFirstDigit(line.slice(i));
            if (digit !== undefined) {
                digits.push(digit);
            }
        }
        return digits;
    });

    return getFirstAndLastValue(digitLines);
};

console.log(numbers(input));

console.log(numbersText(input));
