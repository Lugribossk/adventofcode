import fs from "fs";
import path from "path";

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

const noAnagrams = (input: number[]) => {
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

const run = (content: string, filter: (input: string[]) => boolean) => {
    const phrases = content.split("\r\n").map(n => n.split(" "));
    console.log(phrases.filter(filter).length);
};

const input = fs.readFileSync(path.resolve(__dirname, "4.txt"), "utf8");

run(input, noDuplicates);

run(input, p => noDuplicates(p) && noAnagrams(p));
