const puzzleInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const directions = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

// convert coordinates to a single number so that we can compare if they're equal
const coordsToHash = (r, c) => r * 1e5 + c;

// function to move the head knot
const movePoint = (point, direction) => {
  const nextPoint = point.map((component, i) => component + direction[i]);
  return nextPoint;
};

// function to move a tail knot
const followPoint = (leadingPoint, followingPoint) => {
  const pointDiff = leadingPoint.map(
    (component, i) => component - followingPoint[i]
  );

  const direction = pointDiff.map((component) => {
    const sign = Math.sign(component);
    return component ? sign * (sign * component - 1) : 0;
  });

  const nextPoint = direction.some((component) => component)
    ? leadingPoint.map((component, i) => component - direction[i])
    : followingPoint;

  return nextPoint;
};

// function to update all knot locations on the rope
const updatePoints = (n, direction, { headPoint, tailPoints, tailSet }) => {
  const nextHeadPoint = movePoint(headPoint, direction);

  const { nextTailPoints } = tailPoints.reduce(
    ({ nextTailPoints, lastPoint }, tailPoint) => {
      const nextTailPoint = followPoint(lastPoint, tailPoint);
      return {
        nextTailPoints: [...nextTailPoints, nextTailPoint],
        lastPoint: nextTailPoint,
      };
    },
    { nextTailPoints: [], lastPoint: nextHeadPoint }
  );

  const nextTailSet = new Set([
    ...tailSet,
    coordsToHash(...nextTailPoints[nextTailPoints.length - 1]),
  ]);

  const results = {
    headPoint: nextHeadPoint,
    tailPoints: nextTailPoints,
    tailSet: nextTailSet,
  };

  return n > 1 ? updatePoints(n - 1, direction, results) : results;
};

const instructions = puzzleInput.split("\n");

// follow the instructions and count the unique locations of the last tail knot
const countTailPositions = (instructions, tailLength) => {
  const { tailSet } = instructions.reduce(
    ({ tailSet, headPoint, tailPoints }, instruction) => {
      const [dir, steps] = instruction.split(" ");
      const direction = directions[dir];
      const numSteps = Number(steps);

      return updatePoints(numSteps, direction, {
        headPoint,
        tailPoints,
        tailSet,
      });
    },
    {
      tailSet: new Set(),
      headPoint: [0, 0],
      tailPoints: Array.from({ length: tailLength }, () => [0, 0]),
    }
  );

  return tailSet.size;
};

// PART 1
const countOf1TailKnot = countTailPositions(instructions, 1);
console.log(countOf1TailKnot);

// PART 2
const countOf9TailKnots = countTailPositions(instructions, 9);
console.log(countOf9TailKnots);
