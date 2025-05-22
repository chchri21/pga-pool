// pages/api/submitPicks.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    const score = calculateScore(picks);

    const { error } = await supabase.from('picks').insert([
      {
        name,
        email,
        picks,
        score,
        round_scores: roundScores,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save pick' });
    }

    return res.status(200).json({ message: 'Pick submitted successfully' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('picks')
      .select('name, score, picks, round_scores')
      .order('score', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to load leaderboard' });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function calculateScore(picks: Record<string, string>) {
  const liveScores: Record<string, number> = {
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
