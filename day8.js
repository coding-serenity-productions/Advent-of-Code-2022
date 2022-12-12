const puzzleInput = `30373
25512
65332
33549
35390`;

const coordsToHash = (r, c) => r * 1e5 + c;
const matrix = puzzleInput.split("\n").map((row) => [...row]);
const [n, m] = [matrix.length, matrix[0].length];

// PART 1
const findVisible = (matrix, r, c, dr, dc, tallest = -1) =>
  r in matrix && c in matrix[0]
    ? matrix[r][c] > tallest
      ? new Set([
          ...findVisible(matrix, r + dr, c + dc, dr, dc, matrix[r][c]),
          coordsToHash(r, c),
        ])
      : findVisible(matrix, r + dr, c + dc, dr, dc, tallest)
    : new Set();

const allVisibleTreesSet = matrix.reduce(
  (horizontalSet, _, r, matrix) =>
    // visible from horizontal edges
    new Set([
      ...horizontalSet,
      ...findVisible(matrix, r, 0, 0, 1),
      ...findVisible(matrix, r, m - 1, 0, -1),
      ...matrix[r].reduce(
        (verticalSet, _, c) =>
          // visible from vertical edges
          new Set([
            ...verticalSet,
            ...findVisible(matrix, 0, c, 1, 0),
            ...findVisible(matrix, n - 1, c, -1, 0),
          ]),
        new Set()
      ),
    ]),
  new Set([])
);

const howManyVisible = allVisibleTreesSet.size;
console.log(howManyVisible);

// PART 2
const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

// recursive function that counts the visible trees from the given location
const countTrees = (matrix, r, c, dr, dc, base) =>
  r + dr in matrix && c + dc in matrix[0]
    ? matrix[r + dr][c + dc] < base
      ? 1 + countTrees(matrix, r + dr, c + dc, dr, dc, base)
      : 1
    : 0;

// count trees in all 4 directions and multiply the results
const getScenicScore = (matrix, r, c) =>
  directions.reduce(
    (product, [dr, dc]) =>
      product * countTrees(matrix, r, c, dr, dc, matrix[r][c]),
    1
  );

// check the scenic score for every location and return the largest one
const bestRowScore = matrix.reduce(
  (best, row, r, matrix) =>
    row.reduce((best, _, c) => {
      const score = getScenicScore(matrix, r, c);
      return Math.max(best, score);
    }, best),
  0
);

console.log(bestRowScore);
