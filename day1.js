const puzzleInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

const createMapTransducer =
  (mapper) =>
  (nextReducer) =>
  (acc, item, ...rest) =>
    nextReducer(acc, mapper(item, ...rest));

const mapToNumber = createMapTransducer(Number);
const sumReducer = (sum, num) => sum + num;

const getSumOfGroup = (group) =>
  group.split("\n").reduce(mapToNumber(sumReducer), 0);

// divide the list into an array of groups
const numberGroups = puzzleInput.split("\n\n");

// find the sum of each group
const groupSums = numberGroups.map(getSumOfGroup);

// PART 1
// find the largest sum
const maxSum = Math.max(...groupSums);
console.log(maxSum);

// PART 2
// find the top 3 sums
const top3Sums = groupSums.reduce(
  ([first, second, third], num) =>
    num > first
      ? [num, first, second]
      : num > second
      ? [first, num, second]
      : num > third
      ? [first, second, num]
      : [first, second, third],
  [-Infinity, -Infinity, -Infinity]
);

// add up the top 3 sums
const sumOfTop3 = top3Sums.reduce(sumReducer, 0);
console.log(sumOfTop3);
