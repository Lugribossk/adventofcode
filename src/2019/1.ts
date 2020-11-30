import {readInput} from "../utils";

const fuel = (mass: number) => Math.max(Math.floor(mass / 3) - 2, 0);

const totalFuel = (mass: number): number => {
    const f = fuel(mass);
    if (f > 0) {
        return f + totalFuel(f);
    }
    return f;
};

const sum = (masses: number[], calc: (f: number) => number) => masses.map(calc).reduce((p, c) => p + c, 0);

const input = readInput(__filename)
    .split("\r\n")
    .map(v => parseInt(v));

console.log(sum(input, fuel));

console.log(sum(input, totalFuel));
