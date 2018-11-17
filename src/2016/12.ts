import * as path from "path";
import {parseAndRun, transpileAndRun} from "./assembunny/run";

// parseAndRun(path.resolve(__dirname, "12.txt"));
//
// transpileAndRun(path.resolve(__dirname, "12.txt"));
//
// parseAndRun(path.resolve(__dirname, "12.txt"), 0, 0, 1);

transpileAndRun(path.resolve(__dirname, "12.txt"), 0, 0, 1);

// 9227465