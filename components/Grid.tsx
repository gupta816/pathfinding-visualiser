import { useEffect, useState } from 'react';
import { algorithms } from '../utils/algorithms';

const ROWS = 20;
const COLS = 40;

export default function Grid({
  algorithm,
  start,
  setStart,
  end,
  setEnd,
  triggerTraverse,
  setTriggerTraverse,
  resetSignal, // ✅ New prop
}: {
  algorithm: string;
  start: { row: number; col: number } | null;
  setStart: (val: { row: number; col: number } | null) => void;
  end: { row: number; col: number } | null;
  setEnd: (val: { row: number; col: number } | null) => void;
  triggerTraverse: boolean;
  setTriggerTraverse: (val: boolean) => void;
  resetSignal: boolean; // ✅ New prop
}) {
  const [grid, setGrid] = useState(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill('empty'))
  );

  const handleClick = (row: number, col: number) => {
    const newGrid = grid.map(r => [...r]);
    if (!start) {
      newGrid[row][col] = 'start';
      setStart({ row, col });
    } else if (!end) {
      newGrid[row][col] = 'end';
      setEnd({ row, col });
    } else {
      newGrid[row][col] = newGrid[row][col] === 'obstacle' ? 'empty' : 'obstacle';
    }
    setGrid(newGrid);
  };

  const addRandomObstacles = () => {
    const newGrid = grid.map(r => [...r]);
    let obstacleCount = 0;
    const maxObstacles = Math.floor((ROWS * COLS) * 0.3); // Limit to 30% of the grid

    while (obstacleCount < maxObstacles) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      if (newGrid[row][col] === 'empty' && (row !== start?.row || col !== start?.col) && (row !== end?.row || col !== end?.col)) {
        newGrid[row][col] = 'obstacle';
        obstacleCount++;
      }
    }

    setGrid(newGrid);
  };

  // Effect for handling the grid reset
  useEffect(() => {
    const newGrid = Array.from({ length: ROWS }, () => Array(COLS).fill('empty'));
    setGrid(newGrid);
  }, [resetSignal]);  // Triggered when resetSignal changes

  // Effect for running algorithm visualization
  useEffect(() => {
    if (triggerTraverse && start && end) {
      const cleanGrid = grid.map(r =>
        r.map(cell => (cell === 'visited' || cell === 'path') ? 'empty' : cell)
      );
      setGrid(cleanGrid);
      algorithms[algorithm](cleanGrid, start, end, setGrid);
      setTriggerTraverse(false);
    }
  }, [triggerTraverse]);

  return (
    <div className="flex flex-col items-center gap-4 w-full p-2">
    <div className="mb-2 w-full flex justify-center">
      <button
        onClick={addRandomObstacles}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded shadow-md text-sm sm:text-base"
      >
        Add Random Obstacles
      </button>
    </div>
  
    <div className="overflow-auto max-w-full">
      <div className="flex flex-col items-center gap-px">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-px">
            {row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleClick(rIdx, cIdx)}
                className={`aspect-square w-4 sm:w-5 md:w-6 cursor-pointer transition duration-75 ${
                  cell === 'start' ? 'bg-blue-500' :
                  cell === 'end' ? 'bg-red-500' :
                  cell === 'obstacle' ? 'bg-black' :
                  cell === 'visited' ? 'bg-yellow-300 animate-pulse' :
                  cell === 'path' ? 'bg-green-400' :
                  'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
  
  );
}
