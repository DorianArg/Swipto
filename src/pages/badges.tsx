import MainLayout from "@/components/MainLayout";
import BadgeList from "@/components/BadgeList";

export default function BadgesPage() {
  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mes badges</h1>
        <BadgeList />
      </div>
    </MainLayout>
  );
}
