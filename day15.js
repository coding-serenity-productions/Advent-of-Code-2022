const puzzleInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

// start by isolating the vital information from the input,
// make a list of sensor and beacon coordinates
const coordExpression =
  /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;
const coords = puzzleInput
  .split("\n")
  .map((str) => str.match(coordExpression).slice(1, 5).map(Number));

// PART 1
// find the x-coordinates of each side of the sensor zone borders at y = 2000000
// sort them in ascending order and use that to calculate the number of covered points
// remove any beacons at this height
const yTarget = 10; // 2e6 for the actual puzzle input
const typeOrder = { start: 0, beacon: 1, end: 2 };

const xVals = coords
  .reduce((xVals, [xS, yS, xB, yB]) => {
    const dist = Math.abs(xS - xB) + Math.abs(yS - yB) + 1;
    const yDelta = Math.abs(yTarget - yS);
    const distRemaining = dist - yDelta - 1;

    return distRemaining >= 0
      ? yB === yTarget
        ? [
            ...xVals,
            ["start", xS - distRemaining],
            ["end", xS + distRemaining],
            ["beacon", xB],
          ]
        : [...xVals, ["start", xS - distRemaining], ["end", xS + distRemaining]]
      : xVals;
  }, [])
  .sort(
    ([type1, x1], [type2, x2]) =>
      (x1 - x2) * 1e8 + typeOrder[type1] - typeOrder[type2]
  );

// sweep from left to right, counting the layers of overlapping sensor zones
// add a layer for each start and subtract one for each end. when the layers hit
// zero, count all the points from the last x-value where a single layer started
// and remove 1 point for each beacon encountered within at least 1 layer
const { pointCount } = xVals.reduce(
  ({ pointCount, layers, lastStart, lastBeacon }, [type, x]) =>
    type === "start"
      ? {
          pointCount,
          layers: layers + 1,
          lastStart: layers === 0 ? x : lastStart,
          lastBeacon,
        }
      : type === "end"
      ? {
          pointCount: pointCount + (layers === 1 ? x - lastStart + 1 : 0),
          layers: layers - 1,
          lastStart,
          lastBeacon,
        }
      : {
          pointCount: pointCount - (layers > 0 && x > lastBeacon ? 1 : 0),
          layers,
          lastStart,
          lastBeacon: x,
        },
  { pointCount: 0, layers: 0, lastStart: -Infinity, lastBeacon: -Infinity }
);

console.log(pointCount);

// PART 2
// for there to be a single point within the field that isn't covered by the sensor zones,
// it must be adjacent to the borders of 4 different sensor zone diamonds (1 for each type
// of edge). our strategy will be to represent the 4 border lines of each diamond, in
// slope-intercept form (y = m * x + b) but since we know the slope will always be either
// 1 or -1, it's enough to just find the y-intercepts. we'll find all the lines where the
// lower right border of a diamond overlaps with the upper left border of another diamond
// (positive slope lines), and then find the points where those lines intersect the lines
// of overlap between lower left borders and upper right borders. there might be multiple
// of these intersection points, but there should only be one that isn't within the range
// of any of the sensors

// start by finding the 4 y-intercepts (eg: bUpRight means the y-intercept of the line
// that has a positive slope, and is on the right side of the sensor zone)
const yIntercepts = coords.map(([xS, yS, xB, yB], i) => {
  const dist = Math.abs(xS - xB) + Math.abs(yS - yB) + 1;
  const bUpRight = yS - dist - xS;
  const bUpLeft = yS + dist - xS;
  const bDownLeft = yS - dist + xS;
  const bDownRight = yS + dist + xS;
  return { bDownRight, bUpLeft, bDownLeft, bUpRight };
});

// create a list of all the sensor coordinates and manhattan distance covered from
// the sensor. this is to make it easier to check if a point is within the sensor zone
const sensors = coords.map(([xS, yS, xB, yB], i) => {
  const dist = Math.abs(xS - xB) + Math.abs(yS - yB) + 1;
  return { xS, yS, dist };
});

// find all positive-slope lines that intersect
const upMatching = yIntercepts.reduce(
  (matches, { bUpRight }, i) =>
    yIntercepts.reduce(
      (matches, { bUpLeft }, j) =>
        bUpRight === bUpLeft ? new Set([...matches, bUpRight]) : matches,
      matches
    ),
  new Set()
);

// find all negative-slope lines that intersect
const downMatching = yIntercepts.reduce(
  (matches, { bDownRight }, i) =>
    yIntercepts.reduce(
      (matches, { bDownLeft }, j) =>
        bDownRight === bDownLeft ? new Set([...matches, bDownRight]) : matches,
      matches
    ),
  new Set()
);

// given the y-intercepts of a line with slope 1 and a line with slope -1, this
// finds the point of intersection
const findIntersection = (bUp, bDown) => {
  const x = (bDown - bUp) / 2;
  const y = x + bUp;
  return [x, y];
};

// find points of intersection between all positive slope lines and all negative
// slope lines
const intersections = [...upMatching].reduce(
  (points, bUp) =>
    [...downMatching].reduce(
      (points, bDown) => [...points, findIntersection(bUp, bDown)],
      points
    ),
  []
);

// one of these intersection points should be outside the range of all sensors
// and that's the location of the distress signal
const [x, y] = intersections.find(([xP, yP]) =>
  sensors.every(
    ({ xS, yS, dist }) => Math.abs(xP - xS) + Math.abs(yP - yS) >= dist
  )
);

// get the tuning frequency of the distress signal by multiplying the x coordinate
// by 4 million and then adding the y coordinate
const tuningFrequency = 4e6 * x + y;
console.log(tuningFrequency);
