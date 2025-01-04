"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation"; // Correct import for App Router

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname); // Track the active route
  const [isAddSpotPressed, setIsAddSpotPressed] = useState(false); // Track Add Spot button state

  // Update the state whenever the pathname changes
  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  const goToSaved = () => {
    setActiveRoute("/profile?saved=true"); // Update active route before navigation
    router.push("/profile?saved=true");
  };

  const handleAddSpotMouseDown = () => {
    setIsAddSpotPressed(true);
  };

  const handleAddSpotMouseUp = () => {
    setIsAddSpotPressed(false);
  };

  const goToAddSpot = () => {
    if (pathname === "/map") {
      const addSpotEvent = new CustomEvent("openAddSpotForm");
      window.dispatchEvent(addSpotEvent);
    } else {
      router.push("/map");
      setTimeout(() => {
        const addSpotEvent = new CustomEvent("openAddSpotForm");
        window.dispatchEvent(addSpotEvent);
      }, 500);
    }
  };

  const handleNavigation = (route: string) => {
    setActiveRoute(route); // Update active route before navigation
    router.push(route);
  };

  return (
    <nav className="navbar bg-primary">
      <button
        onClick={() => handleNavigation("/home")}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src={
            activeRoute === "/home"
              ? "/icons/home-filled.png"
              : "/icons/home.png"
          }
          alt="Home"
          className="icon-size"
          width={32}
          height={32}
        />
        <span className="hidden md:inline text-sm md:text-lg">Home</span>
      </button>
      <button
        onClick={() => handleNavigation("/map")}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src={
            activeRoute === "/map"
              ? "/icons/location-filled.png"
              : "/icons/location.png"
          }
          alt="Map"
          className="icon-size"
          width={32}
          height={32}
        />
        <span className="hidden md:inline text-sm md:text-lg">Map</span>
      </button>
      <button
        onClick={goToAddSpot}
        onMouseDown={handleAddSpotMouseDown}
        onMouseUp={handleAddSpotMouseUp}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src={isAddSpotPressed ? "/icons/plus-filled.png" : "/icons/plus.png"}
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
          src={
            activeRoute === "/profile?saved=true"
              ? "/icons/bookmark-filled.png"
              : "/icons/bookmark.png"
          }
          alt="Saved"
          className="icon-size"
          width={32}
          height={32}
        />
        <span className="hidden md:inline text-sm md:text-lg">Saved</span>
      </button>
      <button
        onClick={() => handleNavigation("/profile")}
        className="relative bottom-1 flex flex-col items-center md:flex-row md:space-x-4"
      >
        <Image
          src={
            activeRoute === "/profile"
              ? "/icons/user-filled.png"
              : "/icons/user.png"
          }
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
