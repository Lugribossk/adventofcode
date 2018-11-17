import * as path from "path";
import {parseAndRun} from "./assembunny/run";

parseAndRun(path.resolve(__dirname, "23.txt"), 7);

parseAndRun(path.resolve(__dirname, "23.txt"), 12);
