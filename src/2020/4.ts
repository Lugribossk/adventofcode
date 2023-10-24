import {readInput} from "../utils";

type Passport = {
    byr?: string;
    iyr?: string;
    eyr?: string;
    hgt?: string;
    hcl?: string;
    ecl?: string;
    pid?: string;
    cid?: string;
};

const isValidByFields = ({byr, iyr, eyr, hgt, hcl, ecl, pid}: Passport) => {
    return byr && iyr && eyr && hgt && hcl && ecl && pid;
};

const isValidBirthYear = (text: string) => {
    const value = parseInt(text);
    return value >= 1920 && value <= 2002;
};

const isValidIssueYear = (text: string) => {
    const value = parseInt(text);
    return value >= 2010 && value <= 2020;
};

const isValidExpirationYear = (text: string) => {
    const value = parseInt(text);
    return value >= 2020 && value <= 2030;
};

const isValidHeight = (text: string) => {
    const unit = text.slice(-2);
    const value = parseInt(text.slice(0, -2));
    if (unit === "cm") {
        return value >= 150 && value <= 193;
    }
    if (unit === "in") {
        return value >= 59 && value <= 76;
    }
    return false;
};

const isValidHairColor = (text: string) => {
    return /^#[0-9a-f]{6}$/.test(text);
};

const isValidEyeColor = (text: string) => {
    return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(text);
};

const isValidPassportId = (text: string) => {
    return /^\d{9}$/.test(text);
};

const isValidByValues = ({byr, iyr, eyr, hgt, hcl, ecl, pid}: Passport) => {
    if (!byr || !iyr || !eyr || !hgt || !hcl || !ecl || !pid) {
        return false;
    }
    return (
        isValidBirthYear(byr) &&
        isValidIssueYear(iyr) &&
        isValidExpirationYear(eyr) &&
        isValidHeight(hgt) &&
        isValidHairColor(hcl) &&
        isValidEyeColor(ecl) &&
        isValidPassportId(pid)
    );
};

const input = readInput(import.meta.url)
    .split("\r\n\r\n")
    .map(group => {
        const matches = Array.from(group.matchAll(/(\w+:\S+)/g));
        const out: Passport = {};
        matches.forEach(match => {
            const [key, value] = match[0].split(":");
            out[key as keyof Passport] = value;
        });
        return out;
    });

console.log(input.filter(isValidByFields).length);

console.log(input.filter(isValidByValues).length);
