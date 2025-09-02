import { useEffect, useMemo, useState } from "react";

type Row = { coinId: string; likes: number };
type Resp = { season: { key: string; name: string }; leaderboard: Row[] };

const COIN_LOGOS: Record<string, string> = {
  bitcoin: "/logos/bitcoin.png",
  ethereum: "/logos/ethereum.png",
};

export default function Leaderboard({ seasonKey }: { seasonKey?: string }) {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = seasonKey
      ? `/api/sql/leaderboard?seasonKey=${seasonKey}`
      : "/api/sql/leaderboard";
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [seasonKey]);

  const seasonName = data?.season?.name ?? "Saison";

  if (loading) return <p>Chargement du leaderboard…</p>;
  if (!data?.leaderboard?.length)
    return <p>Aucun résultat pour cette saison.</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">{seasonName}</h2>
      <ul className="divide-y divide-neutral-200">
        {data.leaderboard.map((row, idx) => {
          const logo = COIN_LOGOS[row.coinId];
          return (
            <li
              key={row.coinId}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-right">{idx + 1}.</span>
                {logo ? (
                  <img
                    src={logo}
                    alt={row.coinId}
                    className="w-6 h-6 rounded"
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-neutral-200" />
                )}
                <span className="font-medium">{row.coinId}</span>
              </div>
              <span className="text-sm text-neutral-600">
                {row.likes} likes
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
