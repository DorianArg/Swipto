// components/Sidebar/FilterModal.tsx
import { useEffect, useState } from "react";

export type CryptoFilters = {
  category: string | null;
  top: number;
  priceMin: number | null;
  priceMax: number | null;
  volumeMin: number | null;
  volumeMax: number | null;
};

type Props = {
  open: boolean;
  filters: CryptoFilters;
  onApply: (f: CryptoFilters) => void;
  onCancel: () => void;
  onReset: () => void;
};

export default function FilterModal({
  open,
  filters,
  onApply,
  onCancel,
  onReset,
}: Props) {
  const [categories, setCategories] = useState<
    { category_id: string; name: string }[]
  >([]);
  const [localFilters, setLocalFilters] = useState<CryptoFilters>(filters);

  // Fetch categories from CoinGecko at mount
  useEffect(() => {
    if (!open) return;
    fetch("https://api.coingecko.com/api/v3/coins/categories/list")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [open]);

  // Reset local filters when modal opens
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-[#23243a] rounded-xl p-8 shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-white">Filtres avancés</h2>
        {/* Catégorie */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-[#F7A600]">
            Catégorie
          </label>
          <select
            className="w-full input-swipto"
            value={localFilters.category ?? ""}
            onChange={(e) =>
              setLocalFilters((lf) => ({
                ...lf,
                category: e.target.value || null,
              }))
            }
          >
            <option value="">Toutes</option>
            {categories.map((c) => (
              <option value={c.category_id} key={c.category_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {/* Classement */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-[#F7A600]">
            Classement (Top)
          </label>
          <select
            className="w-full input-swipto"
            value={localFilters.top}
            onChange={(e) =>
              setLocalFilters((lf) => ({ ...lf, top: Number(e.target.value) }))
            }
          >
            {[100, 200, 500].map((n) => (
              <option value={n} key={n}>
                Top {n}
              </option>
            ))}
          </select>
        </div>
        {/* Prix min/max */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-[#F7A600]">
              Prix min ($)
            </label>
            <input
              className="input-swipto"
              type="number"
              value={localFilters.priceMin ?? ""}
              onChange={(e) =>
                setLocalFilters((lf) => ({
                  ...lf,
                  priceMin:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              min={0}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-[#F7A600]">
              Prix max ($)
            </label>
            <input
              className="input-swipto"
              type="number"
              value={localFilters.priceMax ?? ""}
              onChange={(e) =>
                setLocalFilters((lf) => ({
                  ...lf,
                  priceMax:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              min={0}
            />
          </div>
        </div>
        {/* Volume min/max */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-[#F7A600]">
              Volume min ($)
            </label>
            <input
              className="input-swipto"
              type="number"
              value={localFilters.volumeMin ?? ""}
              onChange={(e) =>
                setLocalFilters((lf) => ({
                  ...lf,
                  volumeMin:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              min={0}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-[#F7A600]">
              Volume max ($)
            </label>
            <input
              className="input-swipto"
              type="number"
              value={localFilters.volumeMax ?? ""}
              onChange={(e) =>
                setLocalFilters((lf) => ({
                  ...lf,
                  volumeMax:
                    e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              min={0}
            />
          </div>
        </div>
        {/* Boutons */}
        <div className="flex justify-between items-center gap-3">
          <button
            className="btn-accent flex-1"
            onClick={() => onApply(localFilters)}
          >
            Valider
          </button>
          <button
            className="flex-1 py-2 rounded-full bg-gray-700 text-white font-semibold hover:opacity-80 transition"
            onClick={onReset}
            type="button"
          >
            Réinitialiser
          </button>
          <button
            className="flex-1 py-2 rounded-full bg-gray-700 text-white font-semibold hover:opacity-80 transition"
            onClick={onCancel}
            type="button"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
