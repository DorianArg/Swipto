import MainLayout from "@/components/MainLayout";
import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
        <Leaderboard />
      </div>
    </MainLayout>
  );
}
