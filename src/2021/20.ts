import {readInput} from "../utils";

const input = readInput(__filename).split("\r\n");

class CoordinateMap<T> {
    private readonly map: Map<string, T>;

    constructor(entries: readonly (readonly [readonly [number, number], T])[] = []) {
        this.map = new Map(entries.map(([[x, y], value]) => [`${x},${y}`, value]));
    }

    has(x: number, y: number): boolean {
        return this.map.has(`${x},${y}`);
    }

    get(x: number, y: number, defaultValue: T): T {
        if (!this.has(x, y)) {
            return defaultValue;
        }
        return this.map.get(`${x},${y}`)!;
    }

    set(x: number, y: number, value: T): this {
        this.map.set(`${x},${y}`, value);
        return this;
    }

    values() {
        return this.map.values();
    }

    getSurrounding(x: number, y: number, defaultValue: T): [T, T, T, T, T, T, T, T, T] {
        const out = [];
        for (let yy = y - 1; yy <= y + 1; yy++) {
            for (let xx = x - 1; xx <= x + 1; xx++) {
                out.push(this.get(xx, yy, defaultValue));
            }
        }
        return out as [T, T, T, T, T, T, T, T, T];
    }

    getBoundingBox(): {minX: number; minY: number; maxX: number; maxY: number} {
        if (this.map.size === 0) {
            return {minX: 0, minY: 0, maxX: 0, maxY: 0};
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const key of this.map.keys()) {
            const [x, y] = key.split(",").map(n => parseInt(n));
            if (x < minX) {
                minX = x;
            }
            if (y < minY) {
                minY = y;
            }
            if (x > maxX) {
                maxX = x;
            }
            if (y > maxY) {
                maxY = y;
            }
        }

        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY
        };
    }
}

type Val = 0 | 1;

interface State {
    empty: Val;
    values: CoordinateMap<Val>;
    transform: (v: [Val, Val, Val, Val, Val, Val, Val, Val, Val]) => Val;
}

const getInitial = (transformRow: string, dataRows: string[]): State => {
    const valuestoNextValue = new Map(
        transformRow.split("").map((n, i) => {
            const key = i.toString(2).padStart(9, "0");
            const value = n === "#" ? 1 : 0;
            return [key, value] as const;
        })
    );

    return {
        empty: 0,
        values: new CoordinateMap(
            dataRows.flatMap((line, y) => {
                return line.split("").map((n, x) => [[x, y], n === "#" ? 1 : 0] as const);
            })
        ),
        transform: (values: Val[]) => valuestoNextValue.get(values.join(""))!
    };
};

const getNext = ({empty, values, transform}: State): State => {
    const next = new CoordinateMap<Val>();
    const {minX, minY, maxX, maxY} = values.getBoundingBox();

    for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            const surrounding = values.getSurrounding(x, y, empty);
            next.set(x, y, transform(surrounding));
        }
    }

    return {
        empty: transform([empty, empty, empty, empty, empty, empty, empty, empty, empty]),
        values: next,
        transform: transform
    };
};

const getNextRepeat = (initial: State, iterations: number) => {
    let current = initial;
    for (let i = 1; i <= iterations; i++) {
        current = getNext(current);
    }
    return current;
};

const countLit = ({empty, values}: State) => {
    if (empty === 1) {
        return Infinity;
    }
    return [...values.values()].filter(n => n === 1).length;
};

const toString = ({empty, values}: State, margin = 2) => {
    const out = [];
    const {minX, minY, maxX, maxY} = values.getBoundingBox();

    for (let y = minY - margin; y <= maxY + margin; y++) {
        for (let x = minX - margin; x <= maxX + margin; x++) {
            out.push(values.get(x, y, empty) === 1 ? "#" : ".");
        }
        out.push("\r\n");
    }
    return out.join("");
};

const initial = getInitial(input[0], input.slice(2));

console.log(countLit(getNextRepeat(initial, 2)));

console.log(countLit(getNextRepeat(initial, 50)));
