use std::fs;

fn count_increases(input: &Vec<i32>) -> i32 {
    let mut count = 0;
    for (i, v) in input.iter().enumerate() {
        if i > 0 && input[i - 1] < *v {
            count = count + 1;
        }
    }
    count
}

fn main() {
    let input: Vec<i32> = fs::read_to_string("src/2021/1.txt")
        .unwrap()
        .split("\r\n")
        .map(|v| v.parse().unwrap())
        .collect();

    println!("{}", count_increases(&input));

    let threes: Vec<i32> = input
        .windows(3)
        .map(|chunk| chunk[0] + chunk[1] + chunk[2])
        .collect();

    println!("{}", count_increases(&threes));
}
