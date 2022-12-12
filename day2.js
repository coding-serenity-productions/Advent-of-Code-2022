const puzzleInput = `A Y
B X
C Z`;

const sumReducer = (sum, num) => sum + num;
const games = puzzleInput.split("\n");

// PART 1
const scoreValues = {
  "A X": 4,
  "A Y": 8,
  "A Z": 3,
  "B X": 1,
  "B Y": 5,
  "B Z": 9,
  "C X": 7,
  "C Y": 2,
  "C Z": 6,
};

const getTheScore = (game) => scoreValues[game];

// get the scores of all the games
const scores = games.map(getTheScore);

// add them all up
const totalScore = scores.reduce(sumReducer, 0);
console.log(totalScore);

// PART 2
const actualScoreValues = {
  "A X": 3,
  "A Y": 4,
  "A Z": 8,
  "B X": 1,
  "B Y": 5,
  "B Z": 9,
  "C X": 2,
  "C Y": 6,
  "C Z": 7,
};

const getTheActualScore = (game) => actualScoreValues[game];

const actualScores = games.map(getTheActualScore);
const actualTotalScore = actualScores.reduce(sumReducer, 0);

console.log(actualTotalScore);
