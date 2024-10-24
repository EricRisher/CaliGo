"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation"; // Correct import for App Router

export function Navigation() {
  const router = useRouter();

  const goToSaved = () => {
    router.push("/profile?saved=true");
  };

  const pathname = usePathname();

  const goToAddSpot = () => {
    if (pathname === "/map") {
      // Dispatch the custom event if we're already on the map page
      const addSpotEvent = new CustomEvent("openAddSpotForm");
      window.dispatchEvent(addSpotEvent);
    } else {
      // Navigate to /map, then trigger the form opening
      router.push("/map");
      setTimeout(() => {
        const addSpotEvent = new CustomEvent("openAddSpotForm");
        window.dispatchEvent(addSpotEvent);
      }, 500); // Delay to ensure route change completes before triggering event
    }
  };

  return (
    <nav className="navbar fixed bottom-0 left-0 w-full flex justify-around items-center bg-primary p-4 rounded-t-[30px]">
      <button
        onClick={() => router.push("/home")}
        className="flex flex-col items-center"
      >
        <Image src="/icons/home.png" alt="Home" width={32} height={32} />
        <span className="text-sm pt-2">Home</span>
      </button>
      <button
        onClick={() => router.push("/map")}
        className="flex flex-col items-center"
      >
        <Image src="/icons/location.png" alt="Map" width={32} height={32} />
        <span className="text-sm pt-2">Map</span>
      </button>
      <button onClick={goToAddSpot} className="flex flex-col items-center">
        <Image src="/icons/plus.png" alt="Add" width={32} height={32} />
        <span className="text-sm pt-2">Add</span>
      </button>
      <button onClick={goToSaved} className="flex flex-col items-center">
        <Image src="/icons/bookmark.png" alt="Saved" width={32} height={32} />
        <span className="text-sm pt-2">Saved</span>
      </button>
      <button
        onClick={() => router.push("/profile")}
        className="flex flex-col items-center"
      >
        <Image src="/icons/user.png" alt="Profile" width={32} height={32} />
        <span className="text-sm pt-2">Profile</span>
      </button>
    </nav>
  );
}
