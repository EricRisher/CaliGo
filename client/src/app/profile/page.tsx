"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedPage from "@/components/ProtectedPage";

type Spot = {
  id: number;
  title: string;
  image: string;
};

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </React.Suspense>
  );
}

function ProfileContent() {
  const [username, setUsername] = useState("Username");
  const [mySpots, setMySpots] = useState<Spot[]>([]);
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const saved = searchParams.get("saved");
  const [activeTab, setActiveTab] = useState(
    saved === "true" ? "Saved Spots" : "My Spots"
  );

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const user = await response.json();
        setUsername(user.username);
        setMySpots(user.mySpots || []);
        setSavedSpots(user.savedSpots || []);
        setIsLoggedIn(true);
      } else {
        console.error("Invalid token or session expired");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        window.location.href = "/";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getXpForNextLevel = (level: number): number => level * 100;

  return (
    <ProtectedPage>
      <div className="relative flex flex-col min-h-screen bg-primary">
        {/* Profile Header */}
        <div className="relative w-full p-4 flex justify-between items-center z-10">
          <button onClick={() => (window.location.href = "/home")}>
            <Image src="/icons/close.png" alt="Close" width={32} height={32} />
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

        {/* Profile Picture and Username */}
        <div className="flex flex-col items-center mt-4 relative z-10">
          <Image src="/icons/user.png" alt="Profile" width={128} height={128} />
          <h1 className="text-2xl">{username}</h1>
        </div>

        {/* XP and Level Section */}
        <section className="flex flex-row justify-around mb-6 relative z-10"></section>
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
              className="bg-blue-500 h-full"
              style={{ width: `${(xp / getXpForNextLevel(level)) * 100}%` }}
            />
          </div>
        </div>

        {/* Tabs for My Spots and Saved Spots */}
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

          {/* Display My Spots or Saved Spots */}
          <div className="grid grid-cols-3 gap-3">
            {activeTab === "My Spots" &&
              mySpots.map((spot) => (
                <div
                  key={spot.id}
                  className="relative overflow-hidden rounded-lg shadow-md"
                  style={{ width: "100%", aspectRatio: "1 / 1" }}
                >
                  <button onClick={() => router.push(`/spot/${spot.id}`)}>
                    <Image
                      src={`${apiUrl}${spot.image}`}
                      alt={spot.title}
                      width={128}
                      height={128}
                      className="rounded-md"
                    />
                  </button>
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

        {/* Footer with Log Out Option */}
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
    </ProtectedPage>
  );
}
