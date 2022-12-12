const puzzleInput = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const sumReducer = (sum, num) => sum + num;
const rucksacks = puzzleInput.split("\n");

// PART 1
// find the common item for each rucksack
const findCommonItem = (rucksack) => {
  // divide the string into two halves
  const halfIndex = rucksack.length / 2;
  const [firstHalf, secondHalf] = [
    rucksack.slice(0, halfIndex),
    rucksack.slice(halfIndex),
  ];

  const firstHalfSet = new Set(firstHalf);

  // find the character of the second half that's also in the first half
  return [...secondHalf].find((item) => firstHalfSet.has(item));
};

// find the priority of each item
const getItemPriority = (item) =>
  item.charCodeAt() - (/[a-z]/.test(item) ? 96 : 38);

// add them all up
const prioritySum = rucksacks
  .reduce((arr, item) => [...arr, findCommonItem(item)], [])
  .map(getItemPriority)
  .reduce(sumReducer, 0);

console.log(prioritySum);

// PART 2
// find the common item in each group of 3 rucksacks
const { prioritySum: prioritySumOfGroups } = rucksacks.reduce(
  ({ commonItems, prioritySum }, rucksack, i) => {
    const itemSet = new Set(rucksack);
    const nextCommonItems =
      i % 3 ? commonItems.filter((item) => itemSet.has(item)) : [...rucksack];

    return i % 3 === 2
      ? { prioritySum: prioritySum + getItemPriority(...nextCommonItems) }
      : { commonItems: nextCommonItems, prioritySum };
  },
  { commonItems: [], prioritySum: 0 }
);

console.log(prioritySumOfGroups);
