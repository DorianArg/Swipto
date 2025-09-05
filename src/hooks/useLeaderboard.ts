import { useEffect, useState, useCallback } from "react";

export interface LeaderboardItem {
  rank: number;
  coinId: string;
  symbol: string;
  name: string;
  category: string | null;
  likeCount: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardItem[];
  total: number;
  error?: string;
}

export const useLeaderboard = (
  limit: number = 20,
  options?: { autoFetch?: boolean }
) => {
  const autoFetch = options?.autoFetch ?? true;

  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`/api/leaderboard?limit=${limit}`, {
        cache: "no-store",
      });
      const json: LeaderboardResponse = await resp.json();
      if (!resp.ok || !json.success) {
        throw new Error(
          json.error || "Erreur lors de la récupération du leaderboard"
        );
      }
      setData(json.data);
    } catch (e: any) {
      setError(e?.message ?? "Erreur inconnue");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchLeaderboard();
    }
  }, [autoFetch, fetchLeaderboard]);

  return { data, loading, error, refetch: fetchLeaderboard };
};
