"use client";

import Image from "next/image";

export function Header() {
  return (
    <header className="header fixed top-0 left-0 w-full flex justify-between items-center bg-primary p-4 shadow-md z-10">
      <Image src="/icons/icon-trans.png" alt="CaliGo" width={50} height={50} onClick={() => (window.location.href = "/home")} />
      <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-md">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent focus:outline-none"
        />
        <button>
          <Image src="/icons/filter.png" alt="Filter" width={20} height={20} />
        </button>
      </div>
      <button>
        <Image
          src="/icons/bell.png"
          alt="Notifications"
          width={24}
          height={24}
        />
      </button>
    </header>
  );
}
