const puzzleInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const [stackPart, instructionsPart] = puzzleInput.split("\n\n");

// represent the stacks as an array of strings
const stackMatrix = stackPart
  .split("\n")
  .slice(0, -1)
  .map((row) => [...row].filter((_, i) => i % 4 === 1));

const howManyStacks = stackMatrix[0].length;

const initialStacks = stackMatrix.reduce(
  (arr, row) =>
    row.reduce(
      (arr, char, j) =>
        char === " " ? arr : arr.map((str, k) => (j === k ? str + char : str)),
      arr
    ),
  Array(howManyStacks).fill("")
);

// write a function for moving the crates
const reverse = (str) => [...str].reverse().join("");

// the moved crates are reversed, since they're being moved one at a time
const moveCrates = (stacks, amount, from, to) =>
  stacks.map((stack, i) =>
    i === from - 1
      ? stack.slice(amount)
      : i === to - 1
      ? reverse(stacks[from - 1].slice(0, amount)) + stack
      : stack
  );

// the moved crates aren't reversed, since they're being moved all at once
const multiMoveCrates = (stacks, amount, from, to) =>
  stacks.map((stack, i) =>
    i === from - 1
      ? stack.slice(amount)
      : i === to - 1
      ? stacks[from - 1].slice(0, amount) + stack
      : stack
  );

// parse the list of instructions and execute them
const convertInstruction = (instructionStr) => {
  const [amount, from, to] = instructionStr
    .match(/move (\d+) from (\d+) to (\d+)/)
    .slice(1)
    .map(Number);
  return [amount, from, to];
};

const instructions = instructionsPart.split("\n").map(convertInstruction);

// PART 1
const finalStacks = instructions.reduce(
  (stacks, [amount, from, to]) => moveCrates(stacks, amount, from, to),
  initialStacks
);

const stackTops = finalStacks.map((stack) => stack[0]).join("");
console.log(stackTops);

// PART 2
const finalStacks2 = instructions.reduce(
  (stacks, [amount, from, to]) => multiMoveCrates(stacks, amount, from, to),
  initialStacks
);

const stackTops2 = finalStacks2.map((stack) => stack[0]).join("");
console.log(stackTops2);
