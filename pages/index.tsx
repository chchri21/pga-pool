import { useState } from 'react';
import { supabase } from '../lib/supabase'; // ✅ Fixed path

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [picks, setPicks] = useState({
    A: '',
    B: '',
    C: '',
  });
  const [responseMsg, setResponseMsg] = useState('');

  const handlePick = (tier: string, golfer: string) => {
    setPicks((prev) => ({ ...prev, [tier]: golfer }));
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/submitPicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, picks }),
    });

    const data = await res.json();
    setResponseMsg(data.message || data.error);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">🏌️ PGA Pick 3 Pool</h1>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      <input
        type="email"
        placeholder="Your Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      {['A', 'B', 'C'].map((tier) => (
        <div key={tier} className="mb-4">
          <label className="block font-semibold mb-2">Tier {tier}</label>
          {getGolfersByTier(tier).map((golfer) => (
            <div key={golfer}>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name={tier}
                  value={golfer}
                  checked={picks[tier as keyof typeof picks] === golfer}
                  onChange={() => handlePick(tier, golfer)}
                />
                <span>{golfer}</span>
              </label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit Picks
      </button>

      {responseMsg && (
        <p className="mt-4 text-center text-green-600 font-semibold">{responseMsg}</p>
      )}
    </div>
  );
}

function getGolfersByTier(tier: string): string[] {
  const golfers = {
    A: ['Scottie Scheffler', 'Rory McIlroy', 'Jon Rahm'],
    B: ['Collin Morikawa', 'Tony Finau'],
    C: ['Rickie Fowler', 'Sahith Theegala'],
  };

  return golfers[tier as keyof typeof golfers] || [];
}
