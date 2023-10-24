import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(v => parseInt(v))
    .sort((a, b) => a - b);

task1: for (const a of input) {
    for (const b of input) {
        if (a + b === 2020) {
            console.log(a * b);
            break task1;
        }
        if (a + b > 2020) {
            break;
        }
    }
}

task2: for (const a of input) {
    for (const b of input) {
        for (const c of input) {
            if (a + b + c === 2020) {
                console.log(a * b * c);
                break task2;
            }
            if (a + b + c > 2020) {
                break;
            }
        }
    }
}
