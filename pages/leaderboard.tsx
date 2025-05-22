// pages/leaderboard.tsx
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch("/api/submitPicks");
      const data = await res.json();
      setEntries(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 PGA Pool Leaderboard</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-center">No entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="text-left px-4 py-2 text-sm font-semibold">Rank</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Name</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Score</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Picks</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={i}
                  className={
                    i === 0
                      ? "bg-yellow-50 border-t-2 border-yellow-300"
                      : i === 1
                      ? "bg-gray-50 border-t"
                      : i === 2
                      ? "bg-orange-50 border-t"
                      : "border-t"
                  }
                >
                  <td className="px-4 py-2 font-semibold">#{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{entry.name}</td>
                  <td className="px-4 py-2">{entry.score}</td>
                  <td className="px-4 py-2 space-y-2">
                    {Object.entries(entry.picks).map(([tier, golfer]) => (
                      <div key={tier} className="bg-gray-100 rounded px-2 py-1 text-sm">
                        <strong>{tier}:</strong> {golfer}
                        {entry.roundScores?.[golfer] && (
                          <div className="text-xs text-gray-600 mt-1">
                            R1: {entry.roundScores[golfer][0]} | R2: {entry.roundScores[golfer][1]} | R3: {entry.roundScores[golfer][2]} | R4: {entry.roundScores[golfer][3]}
                          </div>
                        )}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 text-center">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Pool Entry
        </a>
      </div>
    </main>
  );
}
