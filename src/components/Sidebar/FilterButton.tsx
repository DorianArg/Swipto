// components/Sidebar/FilterButton.tsx
import { Settings } from "lucide-react";

export default function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Filtres avancés"
      className="ml-2"
      title="Filtres avancés"
      type="button"
    >
      <Settings className="w-6 h-6 text-[#c8cadb] hover:text-[#F7A600] transition" />
    </button>
  );
}
