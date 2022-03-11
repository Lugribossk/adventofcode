use std::fs;

fn get_position(course: &Vec<(&str, i32)>) -> i32 {
    let mut horizontal = 0;
    let mut depth = 0;
    for (direction, amount) in course {
        match *direction {
            "forward" => horizontal += amount,
            "down" => depth += amount,
            "up" => depth -= amount,
            _ => panic!(),
        };
    }

    horizontal * depth
}

fn get_position_aim(course: &Vec<(&str, i32)>) -> i32 {
    let mut horizontal = 0;
    let mut depth = 0;
    let mut aim = 0;
    for (direction, amount) in course {
        match *direction {
            "forward" => {
                horizontal += amount;
                depth += aim * amount;
            }
            "down" => aim += amount,
            "up" => aim -= amount,
            _ => panic!(),
        };
    }

    horizontal * depth
}

fn main() {
    let input = fs::read_to_string("src/2021/2.txt").unwrap();
    let input: Vec<(&str, i32)> = input
        .split("\r\n")
        .map(|v| {
            let x: Vec<&str> = v.split(" ").collect();
            (x[0], x[1].parse().unwrap())
        })
        .collect();

    println!("{}", get_position(&input));
    println!("{}", get_position_aim(&input));
}
