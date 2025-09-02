import { useEffect, useState } from "react";

type Badge = {
  id: string;
  code: string;
  label: string;
  icon?: string | null;
  unlockedAt?: string | null;
};

export default function BadgeShelf() {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    fetch("/api/sql/badges")
      .then((res) => res.json())
      .then(setBadges)
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2">
      {badges.map((b) => (
        <div key={b.id} className="text-center" title={b.label}>
          <div
            className={`w-12 h-12 mx-auto mb-1 rounded-full flex items-center justify-center ${
              b.unlockedAt ? "bg-yellow-200" : "bg-gray-200"}
            `}
          >
            {b.icon ? <img src={b.icon} alt={b.label} /> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

