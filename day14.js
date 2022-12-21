"use strict";
// we're using "use strict" for this solution because it requires support for
// tail call optimization. basically this means that in our recursive functions
// the recursive call is isolated to the return statement, and it won't add on
// to the call stack when calling the function again. tail call optimization
// is currently only supported in the Safari browser, as well as some older
// versions of Node

const puzzleInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const coordsToHash = (r, c) => r * 1e5 + c;
const range = (n) => Array.from({ length: n }, (_, i) => i);

const structures = puzzleInput.split("\n");

// the strategy is to make a set of all the occupied points (in the form of a hash)
// starting with all the structures
const initialPoints = structures.reduce(
  (points, structure) =>
    structure
      .split(" -> ")
      .map((coords) => coords.split(",").map(Number))
      .reduce(
        (points, [c, r], i, arr) =>
          i === arr.length - 1
            ? points
            : (() => {
                const [cNext, rNext] = arr[i + 1];
                const [cDelta, rDelta] = [cNext - c, rNext - r];
                const [dc, dr] = [Math.sign(cDelta), Math.sign(rDelta)];
                const steps = Math.max(Math.abs(cDelta), Math.abs(rDelta));

                return range(steps + 1).reduce(
                  (points, step) =>
                    new Set([
                      ...points,
                      coordsToHash(r + step * dr, c + step * dc),
                    ]),
                  points
                );
              })(),
        points
      ),
  new Set()
);

// find the maximum row containing a structure, so that we can tell if a sand falls off
// (and also for part 2 where we need a floor at the bottom)
const rMax = [...initialPoints].reduce(
  (rMax, hash) => Math.max(rMax, Math.floor(hash / 1e5)),
  0
);

// drop a sand. if it lands, return a new set of points including the new sand
const dropSand = (points, r = 0, c = 500) =>
  r > rMax + 2
    ? points
    : points.has(coordsToHash(r + 1, c + 0))
    ? points.has(coordsToHash(r + 1, c - 1))
      ? points.has(coordsToHash(r + 1, c + 1))
        ? new Set([...points, coordsToHash(r, c)])
        : dropSand(points, r + 1, c + 1)
      : dropSand(points, r + 1, c - 1)
    : dropSand(points, r + 1, c + 0);

// if the point landed, then there should be one more hash in the set
// so if the size of the returned set is larger, add 1 and go again
const countSands = (points, sands = 0) => {
  const nextPoints = dropSand(points);
  return nextPoints.size > points.size
    ? countSands(nextPoints, sands + 1)
    : sands;
};

// PART 1
const sandCount = countSands(initialPoints);
console.log(sandCount);

// PART 2
const floorPoints = range(1001).reduce(
  (points, c) => new Set([...points, coordsToHash(rMax + 2, c)]),
  new Set()
);
const flooredPoints = new Set([...initialPoints, ...floorPoints]);

const flooredSandCount = countSands(flooredPoints);
console.log(flooredSandCount);
