import fs from "fs";
import path from "path";

export const readInput = (filename: string): string => {
    return fs.readFileSync(path.resolve(`${filename.slice(0, -3)}.txt`), "utf8");
};
