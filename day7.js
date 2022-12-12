const puzzleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

const lines = puzzleInput.split("\n");

// go for the list of directory sizes directly (instead of building an actual file tree).
// when we discover a new file, add the size of it to the current directory and every parent directory
const { sizes } = lines.reduce(
  ({ sizes, location }, line) => {
    const doNothing = () => ({ sizes, location });

    const closeDirectory = () => ({ sizes, location: location.slice(0, -1) });

    const goToHomeDirectory = () => ({ sizes, location: [""] });

    const openDirectory = (line) => {
      const dir = line.match(/\$ cd (\w+)/)[1];
      return { sizes, location: [...location, dir] };
    };

    const createFile = (line) => {
      const size = Number(line.match(/(\d+) .+/)[1]);
      const { nextSizes } = location.reduce(
        ({ nextSizes, path }, dir) => {
          const nextPath = `${path}${dir}/`;
          return {
            path: nextPath,
            nextSizes: {
              ...nextSizes,
              [nextPath]: (nextSizes[nextPath] ?? 0) + size,
            },
          };
        },
        { nextSizes: sizes, path: "" }
      );
      return { sizes: nextSizes, location };
    };

    const commandMap = [
      { expression: /\$ cd \.\./, function: closeDirectory },
      { expression: /\$ cd \//, function: goToHomeDirectory },
      { expression: /\$ cd \w+/, function: openDirectory },
      { expression: /\d+ .+/, function: createFile },
    ];

    const command =
      commandMap.find(({ expression }) => expression.test(line))?.function ??
      doNothing;

    return command(line);
  },
  { sizes: {}, location: [""] }
);

// PART 1
// find all the directories under 100000 and add up their sizes
const sizeSum = Object.values(sizes)
  .filter((size) => size <= 1e5)
  .reduce((sum, num) => sum + num, 0);

console.log(sizeSum);

// PART 2
// find the smallest directory that would give us 40M of space if we deleted it
const minDeletionSize = sizes["/"] - 4e7;
const deletionCandidates = Object.values(sizes).filter(
  (size) => size >= minDeletionSize
);
const deletionSize = Math.min(...deletionCandidates);

console.log(deletionSize);
