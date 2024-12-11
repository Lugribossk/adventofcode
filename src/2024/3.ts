import {readInput} from "../utils";

const input = readInput(import.meta.url)
    .matchAll(/(mul)\((\d{1,3}),(\d{1,3})\)|(do)\(\)|(don't)\(\)/g)
    .map(([match, mul, a, b, doo, dont]) => {
        if (mul) {
            return {
                type: "mul",
                a: parseInt(a, 10),
                b: parseInt(b, 10)
            } as const;
        } else if (doo) {
            return {type: "do"} as const;
        } else if (dont) {
            return {type: "dont"} as const;
        }
        throw new Error();
    })
    .toArray();

const mul = (insts: typeof input) => {
    return insts.filter(inst => inst.type === "mul").reduce((acc, curr) => acc + curr.a * curr.b, 0);
};

const mulDoDont = (insts: typeof input) => {
    let doing = true;
    let sum = 0;
    insts.forEach(inst => {
        switch (inst.type) {
            case "mul":
                if (doing) {
                    sum += inst.a * inst.b;
                }
                break;
            case "do":
                doing = true;
                break;
            case "dont":
                doing = false;
                break;
        }
    });
    return sum;
};

console.log(mul(input));

console.log(mulDoDont(input));
