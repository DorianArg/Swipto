import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Badge = { icon?: string | null };

export default function AccountBadgesIcons({ limit = 3 }: { limit?: number }) {
  const { user } = useAuth();
  const [icons, setIcons] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.uid) return setIcons([]);
    fetch(`/api/sql/badges?userId=${user.uid}`)
      .then((r) => r.json())
      .then((d) => {
        const arr = (d?.badges || []) as Badge[];
        const names = arr
          .map((b) => b.icon)
          .filter(Boolean)
          .slice(0, limit) as string[];
        setIcons(names);
      })
      .catch(() => setIcons([]));
  }, [user?.uid, limit]);

  if (!icons.length) return null;

  return (
    <div className="flex items-center gap-1">
      {icons.map((name, i) => {
        const Icon = (Icons as any)[name] || Icons.Award;
        return (
          <Icon key={`${name}-${i}`} className="w-4 h-4 text-yellow-500" />
        );
      })}
    </div>
  );
}
