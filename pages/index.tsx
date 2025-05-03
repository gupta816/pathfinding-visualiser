import { useState } from 'react';
import Grid from '../components/Grid';
import { algorithms } from '../utils/algorithms';

export default function Home() {
  const [algorithm, setAlgorithm] = useState('BFS');
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [triggerTraverse, setTriggerTraverse] = useState(false);
  const [resetSignal, setResetSignal] = useState(false); // ✅ New

  const handleReset = () => {
    setResetSignal(prev => !prev); // Toggle to notify Grid
    setStart(null);
    setEnd(null);
  };

  return (
    <main className="min-h-screen text-white px-4 py-6 space-y-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <h1 className="text-4xl font-extrabold text-center mb-2">Pathfinding Visualizer</h1>
      <p className="text-center text-lg text-gray-300 mb-4">
        Click to select <span className="text-blue-400 font-bold">Start</span>, then <span className="text-red-400 font-bold">End</span>, then add <span className="text-gray-200 font-bold">Obstacles</span>.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded"
        >
          {Object.keys(algorithms).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <button
          onClick={() => setTriggerTraverse(!triggerTraverse)}
          className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded shadow-lg"
        >
          Traverse
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded shadow-lg"
        >
          Reset Grid
        </button>
      </div>
      <Grid
        algorithm={algorithm}
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        triggerTraverse={triggerTraverse}
        setTriggerTraverse={setTriggerTraverse}
        resetSignal={resetSignal} // ✅ New prop
      />
    </main>
  );
}
