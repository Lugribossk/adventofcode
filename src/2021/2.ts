import {readInput} from "../utils";

const input = readInput(__filename)
    .split("\r\n")
    .map(line => {
        const [direction, amount] = line.split(" ");
        return [direction, parseInt(amount)] as const;
    });

const getPosition = (course: (readonly [string, number])[]) => {
    let horizontal = 0;
    let depth = 0;
    course.forEach(([direction, amount]) => {
        if (direction === "forward") {
            horizontal += amount;
        }
        if (direction === "down") {
            depth += amount;
        }
        if (direction === "up") {
            depth -= amount;
        }
    });
    return {
        horizontal: horizontal,
        depth: depth
    };
};

const getPositionAim = (course: (readonly [string, number])[]) => {
    let horizontal = 0;
    let depth = 0;
    let aim = 0;
    course.forEach(([direction, amount]) => {
        if (direction === "forward") {
            horizontal += amount;
            depth += aim * amount;
        }
        if (direction === "down") {
            aim += amount;
        }
        if (direction === "up") {
            aim -= amount;
        }
    });
    return {
        horizontal: horizontal,
        depth: depth
    };
};

const pos = getPosition(input);
console.log(pos.horizontal * pos.depth);

const posAim = getPositionAim(input);
console.log(posAim.horizontal * posAim.depth);
