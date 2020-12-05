import {readInput} from "../utils";

const input = readInput(__filename)
    .split("\r\n")
    .map(line => {
        const row = parseInt(line.slice(0, 7).replace(/F/g, "0").replace(/B/g, "1"), 2);
        const column = parseInt(line.slice(7).replace(/L/g, "0").replace(/R/g, "1"), 2);
        const id = row * 8 + column;
        return {
            row: row,
            columm: column,
            id: id
        };
    })
    .sort((a, b) => b.id - a.id);

console.log(input[0].id);

input.forEach((seat, i) => {
    if (input[i + 1] && input[i + 1].id === seat.id - 2) {
        console.log(seat.id - 1);
    }
});
