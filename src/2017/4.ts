import {readInput} from "../utils";

const noDuplicates = (input: string[]) => {
    const words = new Set<string>();
    const valid = input.map(word => {
        if (words.has(word)) {
            return false;
        }
        words.add(word);
        return true;
    });
    return valid.every(n => n);
};

const canonicalize = (input: string) => {
    const letters = input.split("");
    letters.sort();
    return letters.join("");
};

const noAnagrams = (input: string[]) => {
    const words = new Set<string>();
    const valid = input.map(word => {
        const canonical = canonicalize(word);
        if (words.has(canonical)) {
            return false;
        }
        words.add(canonical);
        return true;
    });
    return valid.every(n => n);
};

const run = (phrases: string[][], filter: (input: string[]) => boolean) => {
    return phrases.filter(filter).length;
};

const input = readInput(__filename)
    .split("\r\n")
    .map(n => n.split(" "));

console.log(run(input, noDuplicates));

console.log(run(input, p => noDuplicates(p) && noAnagrams(p)));
