export const algorithms: Record<string, Function> = {
  BFS: (grid, start, end, setGrid) => {
    const queue = [start];
    const visited = new Set();
    const parent = new Map();

    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];

    const interval = setInterval(() => {
      if (!queue.length) return clearInterval(interval);

      const current = queue.shift();
      const { row, col } = current;
      const key = `${row}-${col}`;
      if (visited.has(key)) return;
      visited.add(key);

      if (grid[row][col] !== 'start' && grid[row][col] !== 'end') {
        grid[row][col] = 'visited';
        setGrid([...grid.map(r => [...r])]);
      }

      if (row === end.row && col === end.col) {
        clearInterval(interval);
        let curr = `${row}-${col}`;
        while (parent.has(curr)) {
          const [r, c] = curr.split('-').map(Number);
          if (grid[r][c] !== 'start' && grid[r][c] !== 'end') grid[r][c] = 'path';
          curr = parent.get(curr);
        }
        setGrid([...grid.map(r => [...r])]);
        return;
      }

      for (let [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc;
        if (
          nr >= 0 && nr < grid.length &&
          nc >= 0 && nc < grid[0].length &&
          !visited.has(`${nr}-${nc}`) &&
          grid[nr][nc] !== 'obstacle'
        ) {
          queue.push({ row: nr, col: nc });
          parent.set(`${nr}-${nc}`, key);
        }
      }
    }, 20);
  },

  DFS: (grid, start, end, setGrid) => {
    // Implement similarly with stack and animation
  },

  Dijkstra: (grid, start, end, setGrid) => {
    // Placeholder - use priority queue and weights if needed
  },

  AStar: (grid, start, end, setGrid) => {
    // Placeholder - use heuristics + cost
  },

  Greedy: (grid, start, end, setGrid) => {
    // Placeholder - heuristics only
  },

  Bidirectional: (grid, start, end, setGrid) => {
    // Placeholder - bidirectional BFS
  }
};
