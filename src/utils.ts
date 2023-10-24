import fs from "node:fs";

export const readInput = (filename: string): string => fs.readFileSync(`${filename.slice(8, -3)}.txt`, "utf8");
