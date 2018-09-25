const input = "";

const sum = (data: string, offset: (length: number) => number) => {
    return data.split("")
        .map(char => parseInt(char, 10))
        .filter((num, i, nums) => num === nums[(i + offset(nums.length)) % nums.length])
        .reduce((prev, current) => prev + current, 0);
};

console.log(sum(input, () => 1));

console.log(sum(input, length => length / 2));