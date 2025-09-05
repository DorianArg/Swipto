/**
 * @jest-environment node
 */
import handler from "../../src/pages/api/leaderboard";
import httpMocks from "node-mocks-http";

jest.mock("src/lib/prisma", () => ({
  __esModule: true,
  default: {
    swipe: { groupBy: jest.fn() },
    coin: { findMany: jest.fn() },
  },
}));

const prisma = require("src/lib/prisma").default;

describe("API /api/leaderboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("inclut superlike quand includeSuperlike=1", async () => {
    (prisma.swipe.groupBy as jest.Mock).mockResolvedValue([]);
    (prisma.coin.findMany as jest.Mock).mockResolvedValue([]);

    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/leaderboard",
      query: { includeSuperlike: "1" },
    });
    const res = httpMocks.createResponse();

    await handler(req as any, res as any);

    expect(prisma.swipe.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { action: { in: ["like", "superlike"] } },
      })
    );
    expect(res.statusCode).toBe(200);
  });
});
