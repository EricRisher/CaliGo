"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // Correct import for App Router

export function Navigation() {
  const router = useRouter();

  const goToSaved = () => {
    router.push("/profile?saved=true");
  };

  return (
    <nav className="navbar fixed bottom-0 left-0 w-full flex justify-around items-center bg-primary p-4 rounded-t-[30px]">
      <button
        onClick={() => router.push("/home")}
        className="flex flex-col items-center"
      >
        <Image src="/icons/home.png" alt="Home" width={48} height={48} />
        <span className="text-sm pt-2">Home</span>
      </button>
      <button
        onClick={() => router.push("/map")}
        className="flex flex-col items-center"
      >
        <Image src="/icons/location.png" alt="Map" width={48} height={48} />
        <span className="text-sm pt-2">Map</span>
      </button>
      <button
        onClick={() => router.push("/add")}
        className="flex flex-col items-center"
      >
        <Image src="/icons/plus.png" alt="Add" width={48} height={48} />
        <span className="text-sm pt-2">Add</span>
      </button>
      <button onClick={goToSaved} className="flex flex-col items-center">
        <Image src="/icons/bookmark.png" alt="Saved" width={48} height={48} />
        <span className="text-sm pt-2">Saved</span>
      </button>
      <button
        onClick={() => router.push("/profile")}
        className="flex flex-col items-center"
      >
        <Image src="/icons/user.png" alt="Profile" width={48} height={48} />
        <span className="text-sm pt-2">Profile</span>
      </button>
    </nav>
  );
}
