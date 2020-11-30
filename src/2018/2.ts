import {readInput} from "../utils";

const countOccurrences = (letters: string[]) => {
    const values = new Map<string, number>();
    letters.forEach(letter => values.set(letter, (values.get(letter) || 0) + 1));
    return Array.from(values.values());
};

const checksum = (lines: string[][]) => {
    let twos = 0;
    let threes = 0;
    lines.forEach(line => {
        const counts = countOccurrences(line);

        if (counts.includes(2)) {
            twos++;
        }
        if (counts.includes(3)) {
            threes++;
        }
    });
    return twos * threes;
};

const commonLetters = (line1: string[], line2: string[]) => {
    return line1.filter((letter, index) => letter === line2[index]);
};

const commonCorrectIds = (lines: string[][]) => {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = i + 1; j < lines.length; j++) {
            const common = commonLetters(line, lines[j]);
            if (common.length === line.length - 1) {
                return common.join("");
            }
        }
    }
    throw new Error();
};

const input = readInput(__filename)
    .split("\r\n")
    .map(line => line.split(""));

console.log(checksum(input));

console.log(commonCorrectIds(input));
