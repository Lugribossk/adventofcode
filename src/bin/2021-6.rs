use std::collections::HashMap;
use std::fs;
use std::hash::Hash;

struct CountingMap<T> {
    map: HashMap<T, i64>,
}

impl<T: Eq + Hash> CountingMap<T> {
    fn increase(&mut self, key: T, amount: i64) {
        let value = self.map.entry(key).or_insert(0);
        *value += amount;
    }

    fn new() -> CountingMap<T> {
        CountingMap {
            map: HashMap::new(),
        }
    }
}

fn get_initial(items: &[i32]) -> CountingMap<i32> {
    let mut out = CountingMap::new();

    for i in items {
        out.increase(*i, 1);
    }
    out
}

fn get_next(counts: CountingMap<i32>) -> CountingMap<i32> {
    let mut out = CountingMap::new();

    for (n, amount) in counts.map {
        if n == 0 {
            out.increase(6, amount);
            out.increase(8, amount);
        } else {
            out.increase(n - 1, amount);
        }
    }
    out
}

fn simulate(initial: &[i32], days: i32) -> i64 {
    let mut state = get_initial(initial);

    for _ in 1..=days {
        state = get_next(state);
    }
    state.map.values().sum()
}

fn main() {
    let input: Vec<i32> = fs::read_to_string("src/2021/6.txt")
        .unwrap()
        .split(',')
        .map(|v| v.parse().unwrap())
        .collect();

    println!("{}", simulate(&input, 80));
    println!("{}", simulate(&input, 256));
}
