import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split(",")
    .map(n => parseInt(n));

class CountingMap<T> extends Map<T, number> {
    increase(key: T, amount: number) {
        this.set(key, (this.get(key) || 0) + amount);
    }
}

const getInitial = (items: number[]) => {
    const out = new CountingMap<number>();

    items.forEach(item => out.increase(item, 1));
    return out;
};

const getNext = (counts: Map<number, number>) => {
    const out = new CountingMap<number>();

    for (const [n, amount] of counts.entries()) {
        if (n === 0) {
            out.increase(6, amount);
            out.increase(8, amount);
        } else {
            out.increase(n - 1, amount);
        }
    }
    return out;
};

const simulate = (initial: number[], days: number) => {
    let state = getInitial(initial);

    for (let i = 1; i <= days; i++) {
        state = getNext(state);
    }
    return [...state.values()].reduce((p, c) => p + c, 0);
};

console.log(simulate(input, 80));

console.log(simulate(input, 256));
