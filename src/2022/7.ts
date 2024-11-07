import {readInput} from "../utils";

const input = readInput(import.meta.url).split("\r\n");

type Directory = {
    name: string;
    parent?: Directory;
    directories: Directory[];
    files: File[];
    size: number;
};

type File = {
    name: string;
    size: number;
};

type FileSystem = {
    root: Directory;
    allDirectories: Directory[];
    allFiles: File[];
};

const parseDirOut = (line: string) => {
    if (line === "$ cd ..") {
        return {type: "dirout"} as const;
    }
    return undefined;
};
const parseDirIn = (line: string) => {
    const match = /^\$ cd ([\w/]+)$/.exec(line);
    if (match) {
        return {type: "dirin", name: match[1]} as const;
    }
    return undefined;
};
const parseLs = (line: string) => {
    if (line === "$ ls") {
        return {type: "ls"} as const;
    }
    return undefined;
};
const parseCreateDir = (line: string) => {
    const match = /^dir (\w+)$/.exec(line);
    if (match) {
        return {type: "createdir", name: match[1]} as const;
    }
    return undefined;
};
const parseCreateFile = (line: string) => {
    const match = /^(\d+) ([\w.]+)$/.exec(line);
    if (match) {
        return {type: "createfile", name: match[2], size: parseInt(match[1])} as const;
    }
    return undefined;
};

const parsers = [parseDirOut, parseDirIn, parseLs, parseCreateDir, parseCreateFile];

type Command = NonNullable<ReturnType<(typeof parsers)[number]>>;

const parseLines = (lines: string[]): Command[] => {
    return lines.map(line => {
        const possibleCommand = parsers.reduce((prev: Command | undefined, curr) => prev || curr(line), undefined);
        if (!possibleCommand) {
            throw new Error(`Unable to parse '${line}'`);
        }
        return possibleCommand;
    });
};

const createFilesystem = (commands: Command[]): FileSystem => {
    const root: Directory = {
        name: "/",
        directories: [],
        files: [],
        size: 0
    };
    const allDirs = [root];
    const allFiles: File[] = [];
    let currentDir = root;

    commands.forEach(command => {
        switch (command.type) {
            case "dirout": {
                if (!currentDir.parent) {
                    throw new Error("Directory has no parent");
                }
                currentDir = currentDir.parent;
                return;
            }
            case "dirin": {
                if (command.name === "/") {
                    currentDir = root;
                    return;
                }

                const target = currentDir.directories.find(d => d.name === command.name);
                if (!target) {
                    throw new Error(`Unknown directory ${command.name}`);
                }
                currentDir = target;
                return;
            }
            case "createfile": {
                const newFile = {
                    name: command.name,
                    size: command.size
                };
                currentDir.files.push(newFile);
                allFiles.push(newFile);
                return;
            }
            case "createdir": {
                const newDir = {
                    name: command.name,
                    parent: currentDir,
                    directories: [],
                    files: [],
                    size: 0
                };
                currentDir.directories.push(newDir);
                allDirs.push(newDir);
                return;
            }
            case "ls":
            default:
                return;
        }
    });

    const initializeSizes = (dir: Directory) => {
        dir.size =
            dir.files.reduce((p, c) => p + c.size, 0) + dir.directories.reduce((p, c) => p + initializeSizes(c), 0);
        return dir.size;
    };
    initializeSizes(root);

    return {
        root: root,
        allDirectories: allDirs,
        allFiles: allFiles
    };
};

const getSmallDirectories = (fs: FileSystem) => {
    return fs.allDirectories.filter(dir => dir.size <= 100000).reduce((p, c) => p + c.size, 0);
};

const getDirectoryToDelete = (fs: FileSystem) => {
    const minRemoveSize = fs.root.size - 40000000;
    return fs.allDirectories.sort((a, b) => a.size - b.size).find(dir => dir.size >= minRemoveSize)!.size;
};

console.log(getSmallDirectories(createFilesystem(parseLines(input))));

console.log(getDirectoryToDelete(createFilesystem(parseLines(input))));
