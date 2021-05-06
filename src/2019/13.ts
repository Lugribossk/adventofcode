import {parse, runProgram} from "./intcode/run";
import {readInput} from "../utils";

type Screen = (0 | 1 | 2 | 3 | 4)[][];

const outputsToState = (outputs: number[]) => {
    const screen: Screen = [];
    let score: number | undefined;

    for (let i = 0; i < outputs.length; i += 3) {
        const x = outputs[i];
        const y = outputs[i + 1];
        const tile = outputs[i + 2];
        if (x === -1 && y === 0) {
            score = tile;
            continue;
        }

        if (!screen[y]) {
            screen[y] = [];
        }
        if (tile === 0 || tile === 1 || tile === 2 || tile === 3 || tile === 4) {
            screen[y][x] = tile;
        } else {
            throw new Error(`Unknown output ${tile} at index ${i + 2}`);
        }
    }
    return {
        screen: screen,
        score: score
    };
};

const stateToChars = ({screen, score}: {screen: Screen; score: number | undefined}) => {
    return `Score: ${score || 0}\r\n${screen
        .map(line =>
            line
                .map(c => {
                    switch (c) {
                        case 0:
                            return " ";
                        case 1:
                            return "#";
                        case 2:
                            return ".";
                        case 3:
                            return "_";
                        case 4:
                            return "o";
                    }
                })
                .join("")
        )
        .join("\r\n")}`;
};

(async () => {
    const input = readInput(__filename);

    const outputs: number[] = [];
    await runProgram(parse(input), {
        input() {
            throw new Error();
        },
        output(n) {
            outputs.push(n);
        }
    });

    const state = outputsToState(outputs);

    console.log(stateToChars(state));
    console.log(state.screen.flatMap(l => l).filter(t => t === 2).length);
})();
