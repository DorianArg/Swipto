// components/SwipeCard.tsx
import { motion, PanInfo } from "framer-motion";
import React from "react";

type Props = {
  data: any;
  onSwipe: (direction: "left" | "right") => void;
  isTop?: boolean;
};

export default function SwipeCard({ data, onSwipe, isTop = false }: Props) {
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 150) onSwipe("right");
    else if (info.offset.x < -150) onSwipe("left");
  };

  return (
    <motion.div
      drag={isTop ? "x" : false}
      onDragEnd={handleDragEnd}
      className={`absolute w-72 h-[460px] bg-neutral-900 rounded-2xl text-white shadow-2xl p-4 ${
        isTop ? "z-20" : "z-10 scale-95 top-4"
      }`}
      style={{ cursor: isTop ? "grab" : "default" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <img
        src={data.image}
        alt={data.name}
        className="w-12 h-12 object-contain mb-2"
      />
      <h2 className="text-xl font-bold">{data.name}</h2>
      <p className="text-sm text-neutral-400 uppercase">{data.symbol}</p>
      <p className="mt-1 text-lg">${data.price}</p>
      <span
        className={`inline-block px-3 py-1 mt-2 rounded-full text-sm ${
          data.trend === "Hausse" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {data.trend}
      </span>
      <div className="mt-4 text-sm text-neutral-300 line-clamp-4">
        {data.summary}
      </div>
    </motion.div>
  );
}
