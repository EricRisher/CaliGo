"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CommentPreview } from "../components/commentPreview";
import EditSpotForm from "./editSpotForm";

// Define interfaces for Spot, Comment, and User
interface Comment {
  commentText: string;
  commentAuthor: {
    username: string;
  };
}

interface User {
  id: number;
  username: string;
}

interface Spot {
  id: number;
  spotName: string;
  location: string;
  city: string;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  User: User;
  comments?: Comment[];
  commentCount?: number;
  likes: number;
  userLiked: boolean;
  userSaved: boolean;
  updatedAt: string;
  creator: User;
}

export function Spots({ spotId }: { spotId?: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const [spotsData, setSpotsData] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [id: number]: boolean }>({});
  const [savedPosts, setSavedPosts] = useState<{ [id: number]: boolean }>({});
  const [commentsData, setCommentsData] = useState<{ [id: number]: Comment[] }>(
    {}
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  // Function to fetch city name from coordinates using Google Maps Geocoding API

  const openEditForm = (spot: Spot) => {
    setSelectedSpot(spot);
    setShowEditForm(true);
  };

  const fetchSpots = async () => {
    try {
      const url = spotId
        ? `${apiUrl}/spots/${spotId}` // Fetch a single spot if spotId is provided
        : `${apiUrl}/spots`; // Fetch all spots if no spotId is provided

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch spots: ${response.statusText}`);
      }

      const data = spotId ? [await response.json()] : await response.json(); // Wrap single spot data in an array

      const spotsWithCity = await Promise.all(
        data.map(async (spot: Spot) => {
          const cityName = (spot.latitude, spot.longitude);
          return { ...spot, location: cityName };
        })
      );

      setSpotsData(spotsWithCity);

      // Map initial liked and saved states
      const initialLikedPosts = spotsWithCity.reduce(
        (acc: { [id: number]: boolean }, spot: Spot) => {
          acc[spot.id] = spot.userLiked;
          return acc;
        },
        {}
      );

      const initialSavedPosts = spotsWithCity.reduce(
        (acc: { [id: number]: boolean }, spot: Spot) => {
          acc[spot.id] = spot.userSaved; // Include `userSaved` from API response
          return acc;
        },
        {}
      );

      setLikedPosts(initialLikedPosts); // Update the likedPosts state
      setSavedPosts(initialSavedPosts); // Update the savedPosts state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching spots:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSpots();
  }, [spotId]);

  const toggleLike = async (spotId: number) => {
    const isLiked = likedPosts[spotId];
    const url = `${apiUrl}/spots/${spotId}/${isLiked ? "unlike" : "like"}`;

    try {
      // Optimistically update the UI
      setLikedPosts((prev) => ({ ...prev, [spotId]: !isLiked }));

      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        // Re-fetch spots data to reflect updated likes
        fetchSpots();
      } else {
        console.error("Failed to toggle like:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleSave = async (spotId: number) => {
    const isSaved = savedPosts[spotId];
    const url = `${apiUrl}/spots/${spotId}/${isSaved ? "unsave" : "save"}`;

    try {
      // Optimistically update the UI
      setSavedPosts((prev) => ({ ...prev, [spotId]: !isSaved }));

      const response = await fetch(url, {
        method: isSaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        fetchSpots();
      } else {
        console.error("Failed to toggle like:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      // Revert UI change on error
      setSavedPosts((prev) => ({ ...prev, [spotId]: isSaved }));
    }
  };

  useEffect(() => {
    if (spotsData.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("show", entry.isIntersecting);
        });
      },
      { rootMargin: "0px", threshold: 0.1 }
    );

    const cards = document.querySelectorAll(".spot");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [spotsData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!spotsData.length) {
    return <p>No spots data available</p>;
  }

  return (
    <div>
      {selectedSpot && showEditForm && (
        <EditSpotForm
          spot={selectedSpot}
          closeForm={() => setShowEditForm(false)}
          loggedInUser={loggedInUser} // Pass the current user
        />
      )}
      {spotsData.map((spot: Spot, id) => (
        <div
          key={id}
          className="spot bg-gray-200 rounded-md shadow-md p-4 mb-4 sm:max-w-sm md:max-w-lg mx-auto"
        >
          <div className="flex justify-between items-center relative">
            <div>
              <p className="font-bold mb-0">{spot.spotName}</p>
              <p className="mt-0">{spot.city}</p>
            </div>
            {/* <img
                src={profilePicture || "/icons/user.png"}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full"
              /> */}
            <Image
              src={"/icons/menu.png"}
              alt="Menu"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => openEditForm(spot)}
            />
          </div>
          <div className=" bg-gray-400 rounded-md mb-2 min-h-[200px] max-h-[500px] overflow-hidden">
            {spot.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spot.image}
                alt={spot.spotName}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <button onClick={() => toggleLike(spot.id)}>
                <Image
                  src={
                    likedPosts[spot.id]
                      ? "/icons/heart-filled.png"
                      : "/icons/heart.png"
                  }
                  alt="Like"
                  width={32}
                  height={32}
                />
              </button>
              <span>{spot.likes}</span>
              <button>
                <Image
                  src="/icons/chat-box.png"
                  alt="Comment"
                  width={32}
                  height={32}
                />
              </button>
              <span>{spot.commentCount || 0}</span>

              <button onClick={() => toggleSave(spot.id)}>
                <Image
                  src={
                    savedPosts[spot.id]
                      ? "/icons/bookmark-filled.png"
                      : "/icons/bookmark.png"
                  }
                  alt="Bookmark"
                  width={32}
                  height={32}
                />
              </button>
            </div>
          </div>
          <div>
            <p className="m-0 pt-2">
              <b>{spot.creator?.username}</b> {spot.description}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <CommentPreview
              comments={
                commentsData[spot.id]?.map((comment) => ({
                  commentText: comment.commentText,
                  username: comment.commentAuthor?.username || "Anonymous",
                })) || []
              }
              onFetchComments={async () => {
                const response = await fetch(`${apiUrl}/comments/${spot.id}`);
                const fetchedComments = await response.json();
                return Array.isArray(fetchedComments)
                  ? fetchedComments.map((comment: Comment) => ({
                      commentText: comment.commentText,
                      username: comment.commentAuthor?.username || "Anonymous",
                    }))
                  : [];
              }}
              spotId={spot.id}
            />
            <button
              onClick={() => {
                window.location.href = `/spot/${spot.id}`;
              }}
              className="bg-gray-300 rounded-lg p-2 px-6"
            >
              See More
            </button>
          </div>
          <div className="mt-1 font-normal text-right">
            {new Date(spot.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
