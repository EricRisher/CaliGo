"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="header bg-primary">
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
