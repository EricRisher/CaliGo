"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Header() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Capture the current scroll position
      const scrollY = window.scrollY;
      setScrollPosition(scrollY > 100 ? 100 : scrollY); // Limit the effect to the first 100px of scroll
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate dynamic styles based on scroll position
  const opacity = 1 - scrollPosition / 100; // Fades out as you scroll
  const transform = `translateY(-${scrollPosition / 2}px)`; // Moves up slightly

  return (
    <header
      className="header bg-primary sticky-header"
      style={{
        opacity, // Dynamic opacity
        transform, // Dynamic transform
      }}
    >
      <Image
        src="/icons/icon-trans.png"
        alt="CaliGo"
        className="icon-logo"
        width={50}
        height={50}
        onClick={() => (window.location.href = "/home")}
      />
      {/* <div className="search flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-md">
        <input
          type="text"
          placeholder="Search spots"
          disabled={false}
          className="bg-transparent focus:outline-none"
        />
        <button>
          <Image
            src="/icons/filter.png"
            alt="Filter"
            width={20}
            height={20}
            className="filter-icon"
          />
        </button>
      </div> */}
      {/* <button>
        <Image
          src="/icons/bell.png"
          alt="Notifications"
          width={32}
          height={32}
          className="ml-3 mr-1 icon-size"
        />
      </button> */}
    </header>
  );
}
