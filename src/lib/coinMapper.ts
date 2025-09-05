export type SwipedCrypto = {
  id: string;
  symbol?: string;
  name?: string;
  swipe_type: "like" | "superlike" | "dislike";
  timestamp?: string;
  category?: string | null;
};

export function mapToCoin(swiped: SwipedCrypto) {
  return {
    id: swiped.id,
    symbol: (swiped.symbol ?? swiped.id).toUpperCase(),
    name: swiped.name ?? swiped.id,
    category: swiped.category ?? null,
  };
}

export function mapToSwipe(userId: string, swiped: SwipedCrypto) {
  return {
    userId,
    coinId: swiped.id,
    action: swiped.swipe_type,
    createdAt: swiped.timestamp ? new Date(swiped.timestamp) : new Date(),
  };
}
