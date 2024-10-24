"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../../../components/button";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </React.Suspense>
  );
}

function ProfileContent() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [username, setUsername] = useState("Username"); // Default username

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/profile", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        const user = await response.json();
        setUsername(user.username);
        setIsLoggedIn(true);
      } else {
        // Handle invalid token (e.g., expired, invalid)
        console.error("Invalid token");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
    }
  };

  const getXpForNextLevel = (level: number) => level * 100;

  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");

  const [activeTab, setActiveTab] = useState(
    saved === "true" ? "Saved Spots" : "My Spots"
  );

  const mySpots = [
    { id: 1, title: "Sunset Cliff" },
    { id: 2, title: "Beach Vibes" },
    { id: 3, title: "Mountain Hike" },
    { id: 4, title: "City Lights" },
    { id: 5, title: "Desert Safari" },
  ];

  const savedSpots = [
    { id: 3, title: "Mountain Hike" },
    { id: 4, title: "City Lights" },
    { id: 5, title: "Desert Safari" },
    { id: 6, title: "Forest Walk" },
    { id: 7, title: "Lake View" },
    { id: 8, title: "River Side" },
    { id: 9, title: "Cave Exploration" },
    { id: 10, title: "Waterfall" },
  ];

  const addSpot = () => {
    const xpForNextLevel = getXpForNextLevel(level);
    const newXp = xp + 100;

    if (newXp >= xpForNextLevel) {
      setXp(xpForNextLevel);

      setTimeout(() => {
        setXp(newXp - xpForNextLevel);
        setLevel(level + 1);
        alert("Congratulations! You've leveled up!");
      }, 500);
    } else {
      setXp(newXp);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        setIsLoggedIn(false);
        alert("You have been logged out!");
        window.location.href = "/";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
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
        {/* SVG content */}
      </div>

      <div className="flex flex-col items-center mt-4 relative z-10">
        <Image
          src="/icons/user.png"
          alt="Profile"
          width={128}
          height={128}
          className="mb-2"
        />
        <h1 className="text-2xl">{username}</h1>
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
        <button onClick={handleLogout} className="text-black hover:underline">
          Log out
        </button>
      </div>
    </div>
  );
}
