import * as fs from "fs";
import * as path from "path";

interface State {
    offsets: number[];
    pc: number;
}

const execute = ({offsets, pc}: State, calculateOffset: (current: number) => number) => {
    const newOffsets = offsets.slice(0);
    newOffsets.splice(pc, 1, calculateOffset(offsets[pc]));
    return {
        offsets: newOffsets,
        pc: pc + offsets[pc],
    }
};

const run = (initial: State, calculateOffset: (current: number) => number) => {
    let state = initial;
    let steps = 0;
    while (state.pc >= 0 && state.pc < state.offsets.length) {
        state = execute(state, calculateOffset);
        steps++;
    }
    console.log("Steps:", steps);
    return state;
};

const parse = (file: string) => {
    const content = fs.readFileSync(file, "utf8");
    const offsets = content.split("\r\n").map(n => parseInt(n, 10));
    return {
        offsets: offsets,
        pc: 0
    }
};

run(parse(path.resolve(__dirname, "5.txt")), n => n + 1);

run(parse(path.resolve(__dirname, "5.txt")), n => n >= 3 ? n - 1 : n + 1);
