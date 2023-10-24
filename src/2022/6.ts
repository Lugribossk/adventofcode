import {readInput} from "../utils";

const input = readInput(import.meta.url).split("");

const findUniquePosition = (chars: string[], numUnique: number) => {
    for (let i = numUnique - 1; i < chars.length; i++) {
        const lastUnique = new Set(chars.slice(i - numUnique + 1, i + 1));
        if (lastUnique.size === numUnique) {
            return i + 1;
        }
    }
    throw new Error();
};

console.log(findUniquePosition(input, 4));

console.log(findUniquePosition(input, 14));
