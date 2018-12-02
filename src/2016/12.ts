import path from "path";
import {parseAndRun, transpileAndRun} from "./assembunny/run";

const file = path.resolve(__dirname, "12.txt");

parseAndRun(file);

transpileAndRun(file);

parseAndRun(file, 0, 0, 1);

transpileAndRun(file, 0, 0, 1);
