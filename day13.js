const puzzleInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

const buildArray = (arrStr) => JSON.parse(arrStr);

// returns 1 if the arrays are in the correct order, -1 if they're
// in the incorrect order, and 0 if they're equal
const compareArrays = (arr1, arr2) =>
  arr1.length && arr2.length
    ? typeof arr1[0] === "number"
      ? typeof arr2[0] === "number"
        ? arr1[0] < arr2[0]
          ? 1
          : arr1[0] > arr2[0]
          ? -1
          : compareArrays(arr1.slice(1), arr2.slice(1))
        : compareArrays([arr1[0]], arr2[0]) ||
          compareArrays(arr1.slice(1), arr2.slice(1))
      : typeof arr2[0] === "number"
      ? compareArrays(arr1[0], [arr2[0]]) ||
        compareArrays(arr1.slice(1), arr2.slice(1))
      : compareArrays(arr1[0], arr2[0]) ||
        compareArrays(arr1.slice(1), arr2.slice(1))
    : arr1.length
    ? -1
    : arr2.length
    ? 1
    : 0;

// convert the puzzle input to an array of pairs of packets
const packetPairs = puzzleInput
  .split("\n\n")
  .map((pair) => pair.split("\n").map(buildArray));

// PART 1
// add up the 1-based indices of all pairs in the correct order
const indexSum = packetPairs.reduce(
  (sum, pair, i) => (compareArrays(...pair) === 1 ? sum + i + 1 : sum),
  0
);

console.log(indexSum);

// PART 2
// instead of adding [[2]] and [[6]] to the packet list, sorting it, then finding
// the indices of these new packets (O(n * log(n))), we can just go through the
// array once and count how many packets are considered less than [[2]] and [[6]]
// using our compareArrays function
const [index2, index6] = packetPairs
  .flat()
  .reduce(
    ([index2, index6], packet) => [
      index2 + (compareArrays(packet, [[2]]) === 1 ? 1 : 0),
      index6 + (compareArrays(packet, [[6]]) === 1 ? 1 : 0),
    ],
    [1, 2]
  );

console.log(index2 * index6);
