import {readInput} from "../utils";

const canReact = (a: string | undefined, b: string | undefined) => {
    return a?.toUpperCase() === b?.toUpperCase() && a !== b;
};

const doReactions = (units: string[]) => {
    const out = units.slice();
    let i = 0;
    while (i < out.length) {
        if (canReact(out[i], out[i + 1])) {
            out.splice(i, 2);
            i--;
        } else {
            i++;
        }
    }
    return out;
};

const withoutEachType = (units: string[]) => {
    const types = new Set(units.map(u => u.toUpperCase()));

    return Array.from(types.values()).map(t => {
        return doReactions(units.filter(u => u.toUpperCase() !== t));
    });
};

const input = readInput(import.meta.url).split("");

console.log(doReactions(input).length);

console.log(withoutEachType(input).sort((a, b) => a.length - b.length)[0].length);
