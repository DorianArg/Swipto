import { Settings } from "lucide-react";
import Image from "next/image";

export default function UserProfile({ user, onSettings }: any) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-[#23243a] border-2 border-[#3f415b]">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              width={56}
              height={56}
              className="object-cover"
            />
          ) : (
            <div className="w-14 h-14 bg-[#F7A600] flex items-center justify-center text-2xl font-bold text-[#23243a]">
              {user?.displayName?.[0] || user?.email?.[0]}
            </div>
          )}
        </div>
        <div>
          <p className="font-extrabold text-xl">
            {user?.displayName || "Utilisateur"}
          </p>
          <p className="text-base text-[#b0b2c8]">{user?.email}</p>
        </div>
      </div>
      <button onClick={onSettings}>
        <Settings className="w-6 h-6 text-[#c8cadb] hover:text-[#F7A600]" />
      </button>
    </div>
  );
}
