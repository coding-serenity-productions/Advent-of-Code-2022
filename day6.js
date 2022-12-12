const puzzleInput = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

// we're using a Set in order to count the number of unique elements.
// if it's equal to the windowSize, then there are no repeat characters in the window
const findUniqueSubstringIndex = (str, windowSize, i = 0) =>
  i + windowSize <= str.length
    ? new Set(str.slice(i, i + windowSize)).size === windowSize
      ? i + windowSize
      : findUniqueSubstringIndex(str, windowSize, i + 1)
    : -1;

// PART 1
console.log(findUniqueSubstringIndex(puzzleInput, 4));

// PART 2
console.log(findUniqueSubstringIndex(puzzleInput, 14));
