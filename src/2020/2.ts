import {readInput} from "../utils";

interface PasswordPolicy {
    a: number;
    b: number;
    letter: string;
    password: string;
}

const isValidByCount = ({a, b, letter, password}: PasswordPolicy) => {
    const counts = new Map<string, number>();
    password.split("").forEach(c => {
        counts.set(c, (counts.get(c) || 0) + 1);
    });
    if (!counts.has(letter)) {
        return false;
    }
    return counts.get(letter)! >= a && counts.get(letter)! <= b;
};

const isValidByCharacter = ({a, b, letter, password}: PasswordPolicy) => {
    return (
        (password[a - 1] === letter && password[b - 1] !== letter) ||
        (password[a - 1] !== letter && password[b - 1] === letter)
    );
};

const input = readInput(__filename)
    .split("\r\n")
    .map(
        (line): PasswordPolicy => {
            const match = /(\d+)-(\d+) (\w): (\w+)/.exec(line);
            if (!match) {
                throw new Error(`Unable to parse '${line}'`);
            }

            return {
                a: parseInt(match[1]),
                b: parseInt(match[2]),
                letter: match[3],
                password: match[4]
            };
        }
    );

console.log(input.filter(isValidByCount).length);

console.log(input.filter(isValidByCharacter).length);
