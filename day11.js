const puzzleInput = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const range = (n) => Array.from({ length: n }, (_, i) => i);
const monkeyExpression =
  /Monkey (\d+):\n  Starting items: ((?:\d+(?:, )?)+)\n  Operation: new = old ([*+]) (\d+|old)\n  Test: divisible by (\d+)\n    If true: throw to monkey (\d+)\n    If false: throw to monkey (\d+)/;

// from the puzzle input, extract monkey behaviour functions, initial item locations, and
// the product of all divisors, for the purpose of keeping the worry levels manageable
// while maintaining the mod operations accuracy
const { monkeyInfo, startingItems, divisorProduct } = puzzleInput
  .split("\n\n")
  .reduce(
    ({ monkeyInfo, startingItems, divisorProduct }, monkeyText) => {
      // assuming the puzzle input lists the monkey info with consecutive indices starting at 0,
      // we won't need to use the index variable
      const [
        index,
        itemList,
        opSymbol,
        opNumStr,
        divisorStr,
        trueIndexStr,
        falseIndexStr,
      ] = monkeyText.match(monkeyExpression).slice(1);

      const [opNum, divisor, trueIndex, falseIndex] = [
        opNumStr,
        divisorStr,
        trueIndexStr,
        falseIndexStr,
      ].map(Number);

      const operation =
        opNumStr === "old"
          ? (x) => x * x
          : opSymbol === "*"
          ? (x) => x * opNum
          : (x) => x + opNum;
      const getNextMonkey = (x) => (x % divisor === 0 ? trueIndex : falseIndex);

      return {
        monkeyInfo: [
          ...monkeyInfo,
          {
            operation,
            getNextMonkey,
          },
        ],
        startingItems: [...startingItems, itemList.split(", ").map(Number)],
        divisorProduct: divisorProduct * Number(divisor),
      };
    },
    { monkeyInfo: [], startingItems: [], divisorProduct: 1 }
  );

// toss all the items the current monkey is holding
const getNextItems = (items, { operation, getNextMonkey }, index, divideBy3) =>
  items[index].reduce(
    (nextItems, item) => {
      const newItem = divideBy3
        ? Math.floor(operation(item) / 3)
        : operation(item) % divisorProduct;
      const nextIndex = getNextMonkey(newItem);
      return nextItems.map((list, i) =>
        i === nextIndex ? [...list, newItem] : list
      );
    },
    items.map((list, i) => (i === index ? [] : list))
  );

// find the top two values in the array and multiply them
const getProductOfTopTwo = (arr) => {
  const { first, second } = arr.reduce(
    ({ first, second }, num) =>
      num > first
        ? { first: num, second: first }
        : num > second
        ? { first, second: num }
        : { first, second },
    { first: -Infinity, second: -Infinity }
  );

  return first * second;
};

// go through the full cycle of monkeys tossing their items, the given number of times
const calculateMonkeyBusiness = (
  monkeyInfo,
  startingItems,
  cycles,
  divideBy3
) => {
  const { inspections } = range(cycles).reduce(
    ({ inspections, items }) =>
      monkeyInfo.reduce(
        ({ inspections, items }, monkey, i) => ({
          inspections: inspections.map(
            (count, j) => count + (i === j && items[i].length)
          ),
          items: getNextItems(items, monkey, i, divideBy3),
        }),
        { inspections, items }
      ),
    { inspections: Array(monkeyInfo.length).fill(0), items: startingItems }
  );

  return getProductOfTopTwo(inspections);
};

// PART 1
const part1Result = calculateMonkeyBusiness(
  monkeyInfo,
  startingItems,
  20,
  true
);
console.log(part1Result);

// PART 2
const part2Result = calculateMonkeyBusiness(
  monkeyInfo,
  startingItems,
  10000,
  false
);
console.log(part2Result);
