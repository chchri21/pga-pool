// pages/api/submitPicks.js

let poolEntries = [];

const handler = (req, res) => {
  if (req.method === 'POST') {
    const { name, email, picks } = req.body;

    if (!name || !picks || typeof picks !== 'object') {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    const roundScores = {
      "Scottie Scheffler": [67, 68, 69, 70],
      "Rory McIlroy": [70, 68, 71, 67],
      "Jon Rahm": [72, 70, 70, 69],
      "Collin Morikawa": [68, 69, 72, 70],
      "Tony Finau": [71, 70, 70, 71],
      "Rickie Fowler": [72, 73, 74, 75],
      "Sahith Theegala": [69, 67, 70, 68]
    };

    const entry = {
      id: Date.now(),
      name,
      email: email || null,
      picks,
      submittedAt: new Date().toISOString(),
      score: calculateScore(picks),
      roundScores,
    };

    poolEntries.push(entry);
    return res.status(200).json({ message: 'Pick submitted', entry });
  } else if (req.method === 'GET') {
    const leaderboard = poolEntries.map(({ name, score, picks, roundScores }) => ({ name, score, picks, roundScores }))
      .sort((a, b) => a.score - b.score);
    return res.status(200).json(leaderboard);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

function calculateScore(picks) {
  const liveScores = {
    "Scottie Scheffler": -8,
    "Rory McIlroy": -3,
    "Jon Rahm": -1,
    "Collin Morikawa": -2,
    "Tony Finau": 0,
    "Rickie Fowler": +2,
    "Sahith Theegala": -4,
  };

  let total = 0;
  Object.values(picks).forEach((player) => {
    const score = liveScores[player];
    if (typeof score === 'number') total += score;
  });
  return total;
}

export default handler;
