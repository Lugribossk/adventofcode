import {readInput} from "../utils";

const input = readInput(__filename).split("\r\n\r\n") as [string, string];

const getInitialState = (): Map<number, string[]> => {
    const initialState: Map<number, string[]> = new Map();

    input[0]
        .split("\r\n")
        .slice(0, -1)
        .forEach(line => {
            for (let i = 0; i < 9; i++) {
                const crate = line[1 + i * 4];
                if (crate !== " ") {
                    if (!initialState.has(i + 1)) {
                        initialState.set(i + 1, []);
                    }
                    initialState.get(i + 1)!.push(crate);
                }
            }
        });

    return initialState;
};

const getMoves = (): {
    amount: number;
    to: number;
    from: number;
}[] => {
    return input[1].split("\r\n").map(line => {
        const match = /move (\d+) from (\d+) to (\d+)/.exec(line);
        if (!match) {
            throw new Error(`Unable to parse '${line}'`);
        }
        return {
            amount: parseInt(match[1]),
            from: parseInt(match[2]),
            to: parseInt(match[3])
        };
    });
};

const doMoves = (onMove: (moved: string[]) => string[]) => {
    const state = getInitialState();

    getMoves().forEach(({amount, from, to}) => {
        const moved = state.get(from)!.splice(0, amount);
        state.get(to)!.unshift(...onMove(moved));
    });

    return [...state.keys()].sort((a, b) => a - b).reduce((prev, curr) => prev + state.get(curr)![0], "");
};

console.log(doMoves(n => n.reverse()));

console.log(doMoves(n => n));
