import {readInput} from "../utils";

type Color = "red" | "green" | "blue";
type Game = {id: number; sets: Record<Color, number>[]};

const input = readInput(import.meta.url)
    .split("\r\n")
    .map(line => {
        const [rawId, rawSets] = line.split(": ");
        const id = parseInt(rawId.slice(5), 10);

        const sets = rawSets.split("; ").map(set => {
            const counts = {
                red: 0,
                green: 0,
                blue: 0
            };

            set.split(", ").forEach(cube => {
                const [count, color] = cube.split(" ");
                counts[color as Color] = parseInt(count, 10);
            });

            return counts;
        });

        return {id: id, sets: sets};
    });

const withinMax = (games: Game[], red: number, green: number, blue: number) => {
    const possible = games.filter(
        game => !game.sets.some(set => set.red > red || set.green > green || set.blue > blue)
    );
    return possible.reduce((acc, curr) => acc + curr.id, 0);
};

const minPossible = (games: Game[]) => {
    return games
        .map(game => {
            let minRed = 0;
            let minGreen = 0;
            let minBlue = 0;

            game.sets.forEach(set => {
                minRed = Math.max(minRed, set.red);
                minGreen = Math.max(minGreen, set.green);
                minBlue = Math.max(minBlue, set.blue);
            });

            return minRed * minGreen * minBlue;
        })
        .reduce((acc, curr) => acc + curr, 0);
};

console.log(withinMax(input, 12, 13, 14));

console.log(minPossible(input));
