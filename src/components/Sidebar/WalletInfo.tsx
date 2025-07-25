export default function WalletInfo({
  realWallet,
  totalInvested,
  swipeAmount,
}: any) {
  return (
    <div className="space-y-2 mb-8">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[#F7A600]">
          Mon wallet actuel :
        </span>
        <span className="text-white text-lg font-bold">
          ${realWallet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-purple-300">Total investi :</span>
        <span className="text-white text-lg font-bold">
          $
          {totalInvested.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-cyan-300">Par swipe :</span>
        <span className="text-white text-lg font-bold">
          ${swipeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
