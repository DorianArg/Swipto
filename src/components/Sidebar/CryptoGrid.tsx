import Image from "next/image";

export default function CryptoGrid({ cryptos }: any) {
  return (
    <div className="grid grid-cols-3 gap-5">
      {cryptos.map((crypto: any) => (
        <div
          key={crypto.id}
          className="bg-[#23243a] p-4 rounded-xl flex flex-col items-center text-center shadow-lg hover:bg-[#2e3046] transition"
        >
          <Image
            src={crypto.image}
            alt={crypto.name}
            width={40}
            height={40}
            className="mb-2"
          />
          <p className="font-bold text-lg mb-1">{crypto.symbol}</p>
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold mb-2 ${
              crypto.trend?.includes("+") ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            {crypto.trend}
          </span>
          <p className="text-white text-base font-semibold mb-1">
            ${crypto.invested_amount}
          </p>
          <p className="text-[11px] text-[#b0b2c8]">
            {new Date(crypto.timestamp).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
