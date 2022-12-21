const puzzleInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const coordsToHash = (r, c) => 1e5 * r + c;
const hashToCoords = (hash) => [Math.floor(hash / 1e5), hash % 1e5];

const rows = puzzleInput.split("\n");

// create a matrix replacing "S" and "E" with "a" and "z" respectively
const matrix = rows.map((row) =>
  [...row].map((char) => (char === "S" ? "a" : char === "E" ? "z" : char))
);

// find the coordinates of the start and end point
const { start, end } = rows.reduce(
  ({ start, end }, row, r) =>
    [...row].reduce(
      ({ start, end }, char, c) => ({
        start: char === "S" ? coordsToHash(r, c) : start,
        end: char === "E" ? coordsToHash(r, c) : end,
      }),
      { start, end }
    ),
  { start: 0, end: 0 }
);

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

// PART 1
// recursive implementation of breadth first search
const findMinStepsToEnd = (matrix, queue, visited) => {
  const [r, c, steps] = queue[0];

  const { nextQueue, nextVisited, foundAnswer } = directions.reduce(
    ({ nextQueue, nextVisited, foundAnswer }, [dr, dc]) => {
      const nextHash = coordsToHash(r + dr, c + dc);

      return r + dr in matrix &&
        c + dc in matrix[0] &&
        !nextVisited.has(nextHash) &&
        matrix[r + dr][c + dc].charCodeAt() <= matrix[r][c].charCodeAt() + 1
        ? {
            nextQueue: [...nextQueue, [r + dr, c + dc, steps + 1]],
            nextVisited: new Set([...nextVisited, nextHash]),
            foundAnswer: nextHash === end ? steps + 1 : foundAnswer,
          }
        : { nextQueue, nextVisited, foundAnswer };
    },
    { nextQueue: queue.slice(1), nextVisited: visited, foundAnswer: -1 }
  );

  return foundAnswer > -1
    ? foundAnswer
    : findMinStepsToEnd(matrix, nextQueue, nextVisited);
};

const startQueue = [[...hashToCoords(start), 0]];
const startVisited = new Set([start]);
const minSteps = findMinStepsToEnd(matrix, startQueue, startVisited);
console.log(minSteps);

// PART 2
// start at the end and walk back until we find an "a"
const findMinStepsFromEnd = (matrix, queue, visited) => {
  const [r, c, steps] = queue[0];

  const { nextQueue, nextVisited, foundAnswer } = directions.reduce(
    ({ nextQueue, nextVisited, foundAnswer }, [dr, dc]) => {
      const nextHash = coordsToHash(r + dr, c + dc);

      return r + dr in matrix &&
        c + dc in matrix[0] &&
        !nextVisited.has(nextHash) &&
        matrix[r + dr][c + dc].charCodeAt() + 1 >= matrix[r][c].charCodeAt()
        ? {
            nextQueue: [...nextQueue, [r + dr, c + dc, steps + 1]],
            nextVisited: new Set([...nextVisited, nextHash]),
            foundAnswer:
              matrix[r + dr][c + dc] === "a" ? steps + 1 : foundAnswer,
          }
        : { nextQueue, nextVisited, foundAnswer };
    },
    { nextQueue: queue.slice(1), nextVisited: visited, foundAnswer: -1 }
  );

  return foundAnswer > -1
    ? foundAnswer
    : findMinStepsFromEnd(matrix, nextQueue, nextVisited);
};

const endQueue = [[...hashToCoords(end), 0]];
const endVisited = new Set([end]);
const minStepsBack = findMinStepsFromEnd(matrix, endQueue, endVisited);
console.log(minStepsBack);
