// ==============================================
// Imports
// ==============================================
import { render, screen } from "@testing-library/react";
import React from "react";
import LeaderboardCard from "@/components/cards/LeaderboardCard";

// ==============================================
// Tests
// ==============================================
describe("LeaderboardCard", () => {
  it("renders coin information", () => {
    // Act: render component with sample props
    render(
      <LeaderboardCard rank={1} name="Bitcoin" symbol="BTC" likeCount={42} />
    );

    // Assert: verify displayed information
    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText(/Bitcoin/)).toBeInTheDocument();
    expect(screen.getByText(/42 likes/)).toBeInTheDocument();
  });

  test("le composant LeaderboardCard est exporté et rend sans crash (props minimales mockées)", () => {
    // On passe des props minimales plausibles pour éviter un crash
    // Ajuster si votre composant attend une API différente
    const props: any = {
      item: {
        rank: 1,
        coinId: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        category: "cryptocurrency",
        likeCount: 5,
      },
    };

    const { container } = render(
      React.createElement(LeaderboardCard as any, props)
    );
    expect(container).toBeTruthy();
  });
});
