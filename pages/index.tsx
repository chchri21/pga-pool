import { useState } from "react";

const golfers = [
  { name: "Scottie Scheffler", tier: "A" },
  { name: "Rory McIlroy", tier: "A" },
  { name: "Jon Rahm", tier: "A" },
  { name: "Collin Morikawa", tier: "B" },
  { name: "Tony Finau", tier: "B" },
  { name: "Rickie Fowler", tier: "C" },
  { name: "Sahith Theegala", tier: "C" },
];

export default function Home() {
  const [picks, setPicks] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

  const handlePick = (tier, golfer) => {
    setPicks((prev) => ({ ...prev, [tier]: golfer }));
  };

  const handleSubmit = async () => {
    if (!name || Object.keys(picks).length < 3) {
      setResponseMsg("Please enter your name and pick one golfer per tier.");
      return;
    }

    const res = await fetch("/api/submitPicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, picks }),
    });

    const data = await res.json();
    if (res.ok) {
      setSubmitted(true);
    } else {
      setResponseMsg(data.error || "Submission failed.");
    }
  };

  const groupedGolfers = golfers.reduce((acc, golfer) => {
    if (!acc[golfer.tier]) acc[golfer.tier] = [];
    acc[golfer.tier].push(golfer);
    return acc;
  }, {});

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏌️ PGA Pick 3 Pool</h1>
      {!submitted ? (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email (optional)</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {Object.entries(groupedGolfers).map(([tier, tierGolfers]) => (
            <div key={tier}>
              <h2 className="text-lg font-semibold">Tier {tier}</h2>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {tierGolfers.map((g) => (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => handlePick(tier, g.name)}
                    className={`p-2 border rounded ${
                      picks[tier] === g.name ? "border-blue-500 bg-blue-50" : ""
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {responseMsg && <p className="text-red-600">{responseMsg}</p>}

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit Picks
          </button>
        </form>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">✅ Your Picks</h2>
          <ul className="list-disc pl-6">
            {Object.entries(picks).map(([tier, golfer]) => (
              <li key={tier}>
                <strong>Tier {tier}:</strong> {golfer}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-green-700">Thanks for submitting, {name}!</p>
        </div>
      )}
    </main>
  );
}
