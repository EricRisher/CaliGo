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
    <nav className="navbar bg-primary">
      <button
        onClick={() => router.push("/home")}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4 "
      >
        <Image
          src="/icons/home.png"
          alt="Home"
          className="icon-size"
          width={32}
          height={32}
        />
        <span className="hidden md:inline text-sm md:text-lg">Home</span>
      </button>
      <button
        onClick={() => router.push("/map")}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src="/icons/location.png"
          alt="Map"
          className="icon-size"
          width={32}
          height={32}
        />
        <span className="hidden md:inline text-sm md:text-lg">Map</span>
      </button>
      <button
        onClick={goToAddSpot}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src="/icons/plus.png"
          alt="Add"
          className="icon-size"
          width={48}
          height={48}
        />
        <span className="hidden md:inline text-sm md:text-lg">Add Spot</span>
      </button>
      <button
        onClick={goToSaved}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src="/icons/bookmark.png"
          alt="Saved"
          className="icon-size"
          width={32}
          height={32}
        />
        <span className="hidden md:inline text-sm md:text-lg">Saved</span>
      </button>
      <button
        onClick={() => router.push("/profile")}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src="/icons/user.png"
          alt="Profile"
          className="icon-size"
          width={32}
          height={32}
        />
        <span className="hidden md:inline text-sm md:text-lg">Profile</span>
      </button>
    </nav>
  );
}
