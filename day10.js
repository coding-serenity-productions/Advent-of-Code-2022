const puzzleInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

const instructions = puzzleInput.split("\n");
const addRegexp = /addx (-?\d+)/;

// create an array of just the x movement values for each cycle
const movements = instructions.reduce(
  (arr, instruction) =>
    addRegexp.test(instruction)
      ? [...arr, 0, Number(instruction.match(addRegexp)[1])]
      : [...arr, 0],
  []
);

// PART 1
const { sum: signalSum } = movements.reduce(
  ({ sum, x }, dx, cycle) => ({
    sum: sum + (cycle % 40 === 19 ? (cycle + 1) * x : 0),
    x: x + dx,
  }),
  { sum: 0, x: 1 }
);

console.log(signalSum);

// PART 2
const { screen } = movements.reduce(
  ({ screen, x }, dx, cycle) => {
    const r = Math.floor(cycle / 40);
    const c = cycle % 40;
    const pixel = Math.abs(x - c) < 2 ? "#" : ".";
    return {
      screen: screen.map((line, i) => (i === r ? line + pixel : line)),
      x: x + dx,
    };
  },
  { screen: Array(6).fill(""), x: 1 }
);

console.log(screen);
