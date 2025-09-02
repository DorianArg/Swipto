import { useEffect, useState } from "react";
import BadgeItem, { BadgeDTO } from "./BadgeItem";
import { useAuth } from "@/context/AuthContext";

export default function BadgeList() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    fetch(`/api/sql/badges?userId=${user.uid}`)
      .then((r) => r.json())
      .then((data) => setBadges(data.badges || []))
      .finally(() => setLoading(false));
  }, [user?.uid]);

  if (!user?.uid) return <p>Connectez-vous pour voir vos badges.</p>;
  if (loading) return <p>Chargement des badges…</p>;
  if (!badges.length) return <p>Aucun badge débloqué pour le moment.</p>;

  return (
    <div className="divide-y divide-neutral-200">
      {badges.map((b) => (
        <BadgeItem key={b.key} badge={b} />
      ))}
    </div>
  );
}
