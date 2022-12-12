const puzzleInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const ranges = puzzleInput.split("\n");

// find the coordinates of each range
const parseRangePair = (rangePair) => {
  const [start1, end1, start2, end2] = rangePair
    .match(/(\d+)-(\d+),(\d+)-(\d+)/)
    .slice(1)
    .map(Number);
  return [start1, end1, start2, end2];
};

// convert the range to a mask (a single integer where the binary representation
// will have a 1 for every bit covered in the range, and a 0 everywhere else)
// we're using a BigInt, since some of the ranges go beyond 53
const getMask = (start, end) =>
  (1n << (BigInt(end) + 1n)) - (1n << BigInt(start));

const coordinates = ranges.map(parseRangePair);

// this bitmask strategy makes it easy to solve both parts at once
const { containingCount, overlappingCount } = coordinates.reduce(
  ({ containingCount, overlappingCount }, [start1, end1, start2, end2]) => {
    const mask1 = getMask(start1, end1);
    const mask2 = getMask(start2, end2);
    const overlap = mask1 & mask2;

    return {
      containingCount:
        containingCount + (overlap === mask1 || overlap === mask2),
      overlappingCount: overlappingCount + (overlap !== 0n),
    };
  },
  { containingCount: 0, overlappingCount: 0 }
);

// PART 1
console.log(containingCount);

// PART 2
console.log(overlappingCount);
