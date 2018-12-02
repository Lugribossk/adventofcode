import fs from "fs";
import path from "path";

const sum = (data: string, offset: (length: number) => number) => {
    return data
        .split("")
        .map(char => parseInt(char))
        .filter((num, i, nums) => num === nums[(i + offset(nums.length)) % nums.length])
        .reduce((prev, current) => prev + current, 0);
};

const input = fs.readFileSync(path.resolve(__dirname, "1.txt"), "utf8");

console.log(sum(input, () => 1));

console.log(sum(input, length => length / 2));
