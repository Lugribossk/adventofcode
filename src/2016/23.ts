import * as path from "path";
import {parseAndRun, transpileAndRun} from "./assembunny/run";

const file = path.resolve(__dirname, "23.txt");

parseAndRun(file, 7);

transpileAndRun(file, 7);

parseAndRun(file, 12);

transpileAndRun(file, 12);
