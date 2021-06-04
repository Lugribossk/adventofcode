import {readInput} from "../utils";

interface State {
    acc: number;
    pc: number;
}

abstract class Instruction {
    readonly arg: number;

    constructor(arg: number) {
        this.arg = arg;
    }

    abstract execute(state: State): State;
}

class Accumulator extends Instruction {
    execute(state: State) {
        return {
            ...state,
            acc: state.acc + this.arg,
            pc: state.pc + 1
        };
    }
}

class Jump extends Instruction {
    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + this.arg
        };
    }
}

class Nop extends Instruction {
    execute(state: State): State {
        return {
            ...state,
            pc: state.pc + 1
        };
    }
}

const input = readInput(__filename)
    .split("\r\n")
    .map((line): Instruction => {
        const [op, rawArg] = line.split(" ");
        const arg = parseInt(rawArg);
        if (op === "acc") {
            return new Accumulator(arg);
        }
        if (op === "jmp") {
            return new Jump(arg);
        }
        if (op === "nop") {
            return new Nop(arg);
        }
        throw new Error(`Unable to parse '${line}`);
    });

const run = (program: Instruction[]) => {
    const visited = new Set<number>();

    let state: State = {
        acc: 0,
        pc: 0
    };

    while (state.pc < program.length && !visited.has(state.pc)) {
        visited.add(state.pc);
        state = program[state.pc].execute(state);
    }

    return {
        termination: visited.has(state.pc) ? "infinite-loop" : "end",
        state: state
    } as const;
};

const findNonLoopAlternate = (program: Instruction[]) => {
    const alternatives: Instruction[][] = [];
    program.forEach((inst, i) => {
        if (inst instanceof Jump) {
            alternatives.push(
                program
                    .slice(0, i)
                    .concat(new Nop(inst.arg))
                    .concat(program.slice(i + 1))
            );
        }
        if (inst instanceof Nop) {
            alternatives.push(
                program
                    .slice(0, i)
                    .concat(new Jump(inst.arg))
                    .concat(program.slice(i + 1))
            );
        }
    });
    alternatives.forEach(alt => {
        const {termination, state} = run(alt);
        if (termination === "end") {
            console.log(state);
        }
    });
};

console.log(run(input));

findNonLoopAlternate(input);
