type Cell = 'empty' | 'start' | 'end' | 'obstacle' | 'visited' | 'path';
type Grid = Cell[][];
interface Coordinates {
  row: number;
  col: number;
}

type AlgorithmFunction = (
  grid: Grid,
  start: Coordinates,
  end: Coordinates,
  setGrid: React.Dispatch<React.SetStateAction<Grid>>
) => void;

const directions = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
];

const isValid = (grid: Grid, row: number, col: number) =>
  row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

function animatePath(
  grid: Grid,
  path: string[],
  setGrid: React.Dispatch<React.SetStateAction<Grid>>
) {
  let i = path.length - 1;

  // Use setTimeout to give time for each update
  const animate = () => {
    if (i < 0) return;
    const [r, c] = path[i--].split('-').map(Number);
    if (grid[r][c] !== 'start' && grid[r][c] !== 'end') grid[r][c] = 'path';
    setGrid([...grid.map(r => [...r])]); // Trigger a re-render
    setTimeout(animate, 30);  // Small delay for animation effect
  };

  animate();
}


export const algorithms: Record<string, AlgorithmFunction> = {
  BFS(grid, start, end, setGrid) {
    const queue: Coordinates[] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, string>();

    const interval = setInterval(() => {
      if (!queue.length) return clearInterval(interval);
      const { row, col } = queue.shift()!;
      const key = `${row}-${col}`;
      if (visited.has(key)) return;

      visited.add(key);
      if (grid[row][col] !== 'start' && grid[row][col] !== 'end') {
        grid[row][col] = 'visited';
        setGrid([...grid.map(r => [...r])]);
      }

      if (row === end.row && col === end.col) {
        clearInterval(interval);
        const path = [];
        let curr = key;
        while (parent.has(curr)) {
          path.push(curr);
          curr = parent.get(curr)!;
        }
        animatePath(grid, path, setGrid);
        return;
      }

      for (let [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc;
        const nKey = `${nr}-${nc}`;
        if (isValid(grid, nr, nc) && !visited.has(nKey) && grid[nr][nc] !== 'obstacle') {
          queue.push({ row: nr, col: nc });
          parent.set(nKey, key);
        }
      }
    }, 20);
  },

  DFS(grid, start, end, setGrid) {
    const stack: Coordinates[] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, string>();

    const interval = setInterval(() => {
      if (!stack.length) return clearInterval(interval);
      const { row, col } = stack.pop()!;
      const key = `${row}-${col}`;
      if (visited.has(key)) return;

      visited.add(key);
      if (grid[row][col] !== 'start' && grid[row][col] !== 'end') {
        grid[row][col] = 'visited';
        setGrid([...grid.map(r => [...r])]);
      }

      if (row === end.row && col === end.col) {
        clearInterval(interval);
        const path = [];
        let curr = key;
        while (parent.has(curr)) {
          path.push(curr);
          curr = parent.get(curr)!;
        }
        animatePath(grid, path, setGrid);
        return;
      }

      for (let [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc;
        const nKey = `${nr}-${nc}`;
        if (isValid(grid, nr, nc) && !visited.has(nKey) && grid[nr][nc] !== 'obstacle') {
          stack.push({ row: nr, col: nc });
          parent.set(nKey, key);
        }
      }
    }, 20);
  },

 
  

  "Greedy Best-First Search"(grid, start, end, setGrid) {
    const h = (r: number, c: number) => Math.abs(r - end.row) + Math.abs(c - end.col);
    const visited = new Set<string>();
    const parent = new Map<string, string>();
    const pq: [number, Coordinates][] = [[h(start.row, start.col), start]];

    const interval = setInterval(() => {
      if (!pq.length) return clearInterval(interval);
      pq.sort((a, b) => a[0] - b[0]);
      const [_, { row, col }] = pq.shift()!;
      const key = `${row}-${col}`;
      if (visited.has(key)) return;
      visited.add(key);

      if (grid[row][col] !== 'start' && grid[row][col] !== 'end') {
        grid[row][col] = 'visited';
        setGrid([...grid.map(r => [...r])]);
      }

      if (row === end.row && col === end.col) {
        clearInterval(interval);
        const path = [];
        let curr = key;
        while (parent.has(curr)) {
          path.push(curr);
          curr = parent.get(curr)!;
        }
        animatePath(grid, path, setGrid);
        return;
      }

      for (let [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc;
        const nKey = `${nr}-${nc}`;
        if (isValid(grid, nr, nc) && !visited.has(nKey) && grid[nr][nc] !== 'obstacle') {
          pq.push([h(nr, nc), { row: nr, col: nc }]);
          parent.set(nKey, key);
        }
      }
    }, 20);
  },

  "Bidirectional BFS"(grid, start, end, setGrid) {
    const visitedStart = new Set<string>();
    const visitedEnd = new Set<string>();
    const parentStart = new Map<string, string>();
    const parentEnd = new Map<string, string>();

    const queueStart: Coordinates[] = [start];
    const queueEnd: Coordinates[] = [end];

    const interval = setInterval(() => {
      const process = (
        queue: Coordinates[],
        visited: Set<string>,
        parent: Map<string, string>,
        otherVisited: Set<string>,
        color: Cell
      ) => {
        if (!queue.length) return null;
        const { row, col } = queue.shift()!;
        const key = `${row}-${col}`;
        if (visited.has(key)) return null;
        visited.add(key);

        if (grid[row][col] === 'empty') {
          grid[row][col] = color;
          setGrid([...grid.map(r => [...r])]);
        }

        for (let [dr, dc] of directions) {
          const nr = row + dr, nc = col + dc;
          const nKey = `${nr}-${nc}`;
          if (
            isValid(grid, nr, nc) &&
            !visited.has(nKey) &&
            grid[nr][nc] !== 'obstacle'
          ) {
            queue.push({ row: nr, col: nc });
            parent.set(nKey, key);
            if (otherVisited.has(nKey)) return nKey;
          }
        }

        return null;
      };

      const meet = process(queueStart, visitedStart, parentStart, visitedEnd, 'visited')
        || process(queueEnd, visitedEnd, parentEnd, visitedStart, 'visited');

      if (meet) {
        clearInterval(interval);
        const path: string[] = [];

        let curr = meet;
        while (parentStart.has(curr)) {
          path.push(curr);
          curr = parentStart.get(curr)!;
        }

        path.reverse();
        curr = meet;
        while (parentEnd.has(curr)) {
          curr = parentEnd.get(curr)!;
          path.push(curr);
        }

        animatePath(grid, path, setGrid);
      }
    }, 20);
  },
};
