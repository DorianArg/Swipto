// ==============================================
// Imports
// ==============================================
import { render, screen } from "@testing-library/react";
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
});
