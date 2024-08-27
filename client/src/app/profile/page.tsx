"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Button from "../../components/button";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const [xp, setXp] = useState(0); // Starting XP for the user
  const [level, setLevel] = useState(1); // Starting level for the user

  const getXpForNextLevel = (level: number) => {
    return level * 100; // XP required for the next level increases with the current level
  };

  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");

  const [activeTab, setActiveTab] = useState(
    saved === "true" ? "Saved Spots" : "My Spots"
  );

  const mySpots = [
    {
      id: 1,
      title: "Sunset Cliff",
    },
    {
      id: 2,
      title: "Beach Vibes",
    },
    {
      id: 3,
      title: "Mountain Hike",
    },
    {
      id: 4,
      title: "City Lights",
    },
    {
      id: 5,
      title: "Desert Safari",
    },
  ];

  const savedSpots = [
    {
      id: 3,
      title: "Mountain Hike",
    },
    {
      id: 4,
      title: "City Lights",
    },
    {
      id: 5,
      title: "Desert Safari",
    },
    {
      id: 6,
      title: "Forest Walk",
    },
    {
      id: 7,
      title: "Lake View",
    },
    {
      id: 8,
      title: "River Side",
    },
    {
      id: 9,
      title: "Cave Exploration",
    },
    {
      id: 10,
      title: "Waterfall",
    },
  ];

  const addSpot = () => {
    const xpForNextLevel = getXpForNextLevel(level);
    const newXp = xp + 100; // Adding 100 XP for each post

    if (newXp >= xpForNextLevel) {
      setXp(xpForNextLevel); // Set XP to max for current level, triggering the transition

      setTimeout(() => {
        setXp(newXp - xpForNextLevel); // Carry over excess XP to the next level
        setLevel(level + 1); // Level up
        alert("Congratulations! You've leveled up!"); // Show alert
      }, 500); // Delay for 0.5 seconds to allow the transition to complete
    } else {
      setXp(newXp); // Just add XP without leveling up
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-primary">
      <div className="relative w-full p-4 flex justify-between items-center z-10">
        <button>
          <Image
            src="/icons/close.png"
            alt="Close"
            width={32}
            height={32}
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/home";
              }
            }}
          />
        </button>
        <button>
          <Image
            src="/icons/bell.png"
            alt="Notifications"
            width={32}
            height={32}
          />
        </button>
      </div>

      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 390 212"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M380.939 204.3C275.509 152.476 289.434 133.541 176.048 151.48C73.1617 167.757 97.2095 145.469 6.10352e-05 74.1897V-1H389.891C422.05 84.7076 465.283 245.758 380.939 204.3Z"
            fill="#C8854B"
            stroke="#C8854B"
          />
        </svg>
      </div>

      <div className="flex flex-col items-center mt-4 relative z-10">
        <Image
          src="/icons/user.png"
          alt="Profile"
          width={128}
          height={128}
          className="mb-2"
        />
        <h1 className="text-2xl">Username</h1>
      </div>

      <section className="flex flex-row justify-around mb-6 relative z-10">
        <Button className="text-sm mt-2" onClick={addSpot}>
          Upload Spot (Add XP)
        </Button>
      </section>

      {/* XP Bar */}
      <div className="relative z-10 w-full px-4 mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Level {level}</span>
          <span>
            {xp}/{getXpForNextLevel(level)} XP
          </span>
          <span>Level {level + 1}</span>
        </div>
        <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full progress-bar"
            style={{ width: `${(xp / getXpForNextLevel(level)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="w-full px-4 relative z-10 bg-slate-300">
        <div className="flex space-x-4 m-4">
          <button
            className={`py-2 px-4 rounded-lg ${
              activeTab === "My Spots"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("My Spots")}
          >
            My Spots
          </button>
          <button
            className={`py-2 px-4 rounded-lg ${
              activeTab === "Saved Spots"
                ? "bg-secondary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("Saved Spots")}
          >
            Saved Spots
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {activeTab === "My Spots" &&
            mySpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-blue-300 rounded-md h-32 flex items-center justify-center"
              >
                <p>{spot.title}</p>
              </div>
            ))}
          {activeTab === "Saved Spots" &&
            savedSpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-blue-300 rounded-md h-32 flex items-center justify-center"
              >
                <p>{spot.title}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-around w-full bg-transparent p-4 mt-auto relative z-10">
        <a href="/credit" className="text-black hover:underline">
          Credit
        </a>
        <a href="/legal" className="text-black hover:underline">
          Legal
        </a>
        <a href="/logout" className="text-black hover:underline">
          Log out
        </a>
      </div>
    </div>
  );
}
