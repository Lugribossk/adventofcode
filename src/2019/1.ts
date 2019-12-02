import fs from "fs";
import path from "path";

const fuel = (mass: number) => Math.max(Math.floor(mass / 3) - 2, 0);

const totalFuel = (mass: number): number => {
    const f = fuel(mass);
    if (f > 0) {
        return f + totalFuel(f);
    }
    return f;
};

const sum = (masses: number[], calc: (f: number) => number) => masses.map(calc).reduce((p, c) => p + c, 0);

const input = fs
    .readFileSync(path.resolve(__dirname, "1.txt"), "utf8")
    .split("\r\n")
    .map(v => parseInt(v));

console.log(sum(input, fuel));

console.log(sum(input, totalFuel));
