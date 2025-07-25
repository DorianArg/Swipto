import useClientLocaleNumber from "@/hooks/useClientLocaleNumber";

export default function WalletInfo({
  realWallet,
  totalInvested,
  swipeAmount,
}: any) {
  const formattedWallet = useClientLocaleNumber(realWallet, "en-US", {
    style: "currency",
    currency: "USD",
  });
  const formattedInvested = useClientLocaleNumber(totalInvested, "en-US", {
    style: "currency",
    currency: "USD",
  });
  const formattedSwipeAmount = useClientLocaleNumber(swipeAmount, "en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="space-y-2 mb-8">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[#F7A600]">
          Mon wallet actuel :
        </span>
        <span className="text-white text-lg font-bold">{formattedWallet}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-purple-300">Total investi :</span>
        <span className="text-white text-lg font-bold">
          {formattedInvested}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-cyan-300">Par swipe :</span>
        <span className="text-white text-lg font-bold">
          {formattedSwipeAmount}
        </span>
      </div>
    </div>
  );
}
