/**
 * @jest-environment node
 */

// ==============================================
// Imports
// ==============================================
import handler from "@/pages/api/leaderboard";
import { getLeaderboard } from "@/api/leaderboard";
import { createMocks } from "node-mocks-http";

// ==============================================
// Mocks
// ==============================================
jest.mock("@/api/leaderboard");

// ==============================================
// Tests
// ==============================================
describe("GET /api/leaderboard", () => {
  it("returns aggregated leaderboard", async () => {
    // Arrange: mock service response
    (getLeaderboard as jest.Mock).mockResolvedValue([
      {
        rank: 1,
        coinId: "btc",
        symbol: "BTC",
        name: "Bitcoin",
        category: null,
        likeCount: 2,
      },
    ]);

    // Act: invoke handler with mocked request/response
    const { req, res } = createMocks({ method: "GET" });
    await handler(req, res);

    // Assert: verify successful payload
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      success: true,
      data: [
        {
          rank: 1,
          coinId: "btc",
          symbol: "BTC",
          name: "Bitcoin",
          category: null,
          likeCount: 2,
        },
      ],
      total: 1,
    });
  });
});
