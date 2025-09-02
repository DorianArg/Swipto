import * as Icons from "lucide-react";

export type BadgeDTO = {
  key: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  unlockedAt: string;
};

export default function BadgeItem({ badge }: { badge: BadgeDTO }) {
  const Icon = (badge.icon && (Icons as any)[badge.icon]) || Icons.Award;
  return (
    <div className="flex items-center gap-2 py-2">
      <Icon className="w-5 h-5 text-yellow-500" />
      <div className="flex flex-col">
        <span className="font-medium">{badge.name}</span>
        {badge.description ? (
          <span className="text-xs text-neutral-500">{badge.description}</span>
        ) : null}
      </div>
    </div>
  );
}
