/**
 * @jest-environment node
 */

// ==============================================
// Imports
// ==============================================
import { getLeaderboard } from "@/api/leaderboard";
import prisma from "@/lib/prisma";

// ==============================================
// Mocks
// ==============================================
jest.mock("@/lib/prisma", () => ({
  swipe: { groupBy: jest.fn() },
  coin: { findMany: jest.fn() },
}));

// ==============================================
// Tests
// ==============================================
describe("getLeaderboard", () => {
  it("aggregates likes and superlikes", async () => {
    // Arrange: mocked grouped swipes and coin data
    const grouped = [
      { coinId: "btc", _count: { coinId: 2 } },
      { coinId: "eth", _count: { coinId: 1 } },
    ];
    const coins = [
      { id: "btc", symbol: "BTC", name: "Bitcoin", category: "Layer1" },
      { id: "eth", symbol: "ETH", name: "Ethereum", category: "Layer1" },
    ];

    (prisma.swipe.groupBy as jest.Mock).mockResolvedValue(grouped);
    (prisma.coin.findMany as jest.Mock).mockResolvedValue(coins);

    // Act: call service
    const result = await getLeaderboard(10);

    // Assert: verify query parameters and returned data
    expect(prisma.swipe.groupBy).toHaveBeenCalledWith({
      by: ["coinId"],
      where: { action: { in: ["like", "superlike"] } },
      _count: { coinId: true },
      orderBy: { _count: { coinId: "desc" } },
      take: 10,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      rank: 1,
      coinId: "btc",
      symbol: "BTC",
      name: "Bitcoin",
      category: "Layer1",
      likeCount: 2,
    });
  });
});
