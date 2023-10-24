import fs from "node:fs";
import {readInput} from "../utils";

type Claim = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

const parse = (line: string): Claim => {
    const match = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(line);
    if (!match) {
        throw new Error(`Unable to parse '${line}'`);
    }

    return {
        id: match[1],
        x: parseInt(match[2]),
        y: parseInt(match[3]),
        width: parseInt(match[4]),
        height: parseInt(match[5])
    };
};

const mark = ({id, x, y, width, height}: Claim, areas: Map<string, string[]>) => {
    for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
            const coords = `${i},${j}`;
            areas.set(coords, (areas.get(coords) || []).concat(id));
        }
    }
};

const findOverlaps = (claims: Claim[]) => {
    const areas = new Map<string, string[]>();
    claims.forEach(c => mark(c, areas));

    return Array.from(areas.values()).filter(values => values.length > 1);
};

const findNonOverlapping = (claims: Claim[], overlaps: string[][]) => {
    const ids = new Set(claims.map(c => c.id));
    overlaps.flat().forEach(id => ids.delete(id));
    return ids;
};

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(line => parse(line));

const overlaps = findOverlaps(input);

console.log(overlaps.length);

console.log(findNonOverlapping(input, overlaps));
