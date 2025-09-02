import { useEffect, useState } from "react";

type Entry = {
  coinId: string;
  likeCount: number;
  coin: { id: string; symbol: string; name: string };
};

export default function LeaderboardCard() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch("/api/sql/leaderboard?season=current&limit=20")
      .then((res) => res.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 rounded-md border border-gray-200">
      <h2 className="font-bold mb-2">Top de la saison</h2>
      <ol className="space-y-1 mb-2">
        {entries.map((e, idx) => (
          <li key={e.coinId} className="flex justify-between">
            <span>
              {idx + 1}. {e.coin.symbol}
            </span>
            <span>{e.likeCount}</span>
          </li>
        ))}
      </ol>
      <a href="#" className="text-sm text-blue-500">
        voir saison
      </a>
    </div>
  );
}

