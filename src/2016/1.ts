
interface Blah {
    turn: "L" | "R",
    distance: number;
}

interface Position {
    x: number,
    y: number,
    direction: "N" | "E" | "S" | "W"
}

const blah = (instructions: Blah[]) => {
    let position: Position = {
        x: 0,
        y: 0,
        direction: "N"
    }
    instructions.forEach(inst => {

    })
}

const parse = (input: string) => {
    input.split(", ")
        .map(entry => ({
            turn: entry.substr(0, 1),
            distance: parseInt(entry.substr(1))
        }));
}