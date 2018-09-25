import * as fs from "fs";
import * as path from "path";

interface Dictionary<T> {
    [key: string]: T;
}

const noDuplicates = (input: string[]) => {
    const words: Dictionary<boolean> = {};
    const valid = input.map(word => {
        if (words[word]) {
            return false;
        }
        words[word] = true;
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
    const words: Dictionary<boolean> = {};
    const valid = input.map(word => {
        const canonical = canonicalize(word);
        if (words[canonical]) {
            return false;
        }
        words[canonical] = true;
        return true;
    });
    return valid.every(n => n);
};

const run = (file: string, callback: (input: string[]) => boolean) => {
    const content = fs.readFileSync(file, "utf8");
    const phrases = content.split("\r\n").map(n => n.split(" "));
    const valid = phrases.map(callback);
    console.log(valid.filter(n => n).length);
};

run(path.resolve(__dirname, "4.txt"), noDuplicates);

run(path.resolve(__dirname, "4.txt"), p => noDuplicates(p) && noAnagrams(p));
