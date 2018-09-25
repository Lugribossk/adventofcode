import * as path from "path";
import {parseAndRun} from "./assembunny/parser";

parseAndRun(path.resolve(__dirname, "12.txt"));

parseAndRun(path.resolve(__dirname, "12.txt"), 0, 0, 1);