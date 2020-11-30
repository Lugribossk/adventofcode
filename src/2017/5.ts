import {readInput} from "../utils";

interface State {
    offsets: number[];
    pc: number;
}

const execute = ({offsets, pc}: State, calculateOffset: (current: number) => number) => {
    const newOffsets = offsets.slice(0);
    newOffsets.splice(pc, 1, calculateOffset(offsets[pc]));
    return {
        offsets: newOffsets,
        pc: pc + offsets[pc]
    };
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

const parse = (content: string): State => {
    const offsets = content.split("\r\n").map(n => parseInt(n));
    return {
        offsets: offsets,
        pc: 0
    };
};

const input = readInput(__filename);

run(parse(input), n => n + 1);

run(parse(input), n => (n >= 3 ? n - 1 : n + 1));
