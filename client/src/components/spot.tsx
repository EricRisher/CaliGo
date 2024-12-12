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
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  User: User;
  comments?: Comment[];
  commentCount?: number;
  likes: number;
  userLiked: boolean;
  updatedAt: string;
  creator: User;
}

export function Spots({ spotId }: { spotId?: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const [spotsData, setSpotsData] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [id: number]: boolean }>({});
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{
    [id: number]: boolean;
  }>({});
  const [commentsData, setCommentsData] = useState<{ [id: number]: Comment[] }>(
    {}
  );
  const [username, setUsername] = useState<string | null>(null);
  const [mySpots, setMySpots] = useState<Spot[]>([]);
  const [savedSpots, setSavedSpots] = useState<Spot[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  // Function to fetch city name from coordinates using Google Maps Geocoding API
  const fetchCityFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (!response.ok) {
        console.error("Failed to fetch city name:", response.statusText);
        return "Unknown Location";
      }

      const data = await response.json();
      const city = data.results[0]?.address_components.find((component: any) =>
        component.types.includes("locality")
      )?.long_name;

      return city || "Unknown Location";
    } catch (error) {
      console.error("Error fetching city name:", error);
      return "Unknown Location";
    }
  };

  const openEditForm = (spot: Spot) => {
    setSelectedSpot(spot);
    setShowEditForm(true);
  };

  const fetchSpots = async () => {
    try {
      const response = await fetch(`${apiUrl}/spots`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch spots: ${response.statusText}`);
      }

      const data: Spot[] = await response.json();

      // Resolve coordinates to city names
      const spotsWithCity = await Promise.all(
        data.map(async (spot) => {
          const cityName = await fetchCityFromCoordinates(
            spot.latitude,
            spot.longitude
          );
          return { ...spot, location: cityName };
        })
      );

      setSpotsData(spotsWithCity);

      // Map initial liked states
      const initialLikedPosts = spotsWithCity.reduce(
        (acc: { [id: number]: boolean }, spot: Spot) => {
          acc[spot.id] = spot.userLiked;
          return acc;
        },
        {}
      );

      setLikedPosts(initialLikedPosts); // Update the likedPosts state
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
      setLikedPosts((prev) => ({ ...prev, [spotId]: !isLiked }));
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to toggle like:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

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
      {spotsData.map((spot: Spot) => (
        <div
          key={spot.id}
          className="spot bg-gray-200 rounded-md shadow-md p-4 mb-4 sm:max-w-sm md:max-w-lg mx-auto"
        >
          <div className="flex justify-between items-center relative">
            <div>
              <p className="font-bold mb-0">{spot.spotName}</p>
              <p className="mt-0">{spot.location}</p>
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
            </div>
          </div>
          <div>
            <p className="m-0 pt-2">
              <b>{spot.creator?.username}</b> {spot.description}
            </p>
          </div>
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
          <div className="mt-1 font-normal text-right">
            {new Date(spot.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
