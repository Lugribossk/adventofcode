import {readInput} from "../utils";

export class CountingMap<T> extends Map<T, number> {
    constructor(entries: T[]) {
        super();
        entries.forEach(entry => this.increase(entry, 1));
    }

    increase(key: T, amount = 1) {
        this.set(key, (this.get(key) ?? 0) + amount);
    }

    override get(key: T) {
        return super.get(key) ?? 0;
    }
}

const input = readInput(import.meta.url).split("\r\n");

const left = input.map(line => parseInt(line.slice(0, 5), 10));
const right = input.map(line => parseInt(line.slice(8, 13), 10));

left.sort();
right.sort();

const diffs = (a: number[], b: number[]) => {
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff += Math.abs(a[i] - b[i]);
    }
    return diff;
};

const similarity = (a: number[], b: number[]) => {
    const bCount = new CountingMap(b);
    return a.reduce((acc, curr) => acc + curr * bCount.get(curr), 0);
};

console.log(diffs(left, right));

console.log(similarity(left, right));
