"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CommentPreview } from "../components/commentPreview";

// Define interfaces for Spot, Comment, and User
interface Comment {
  commentText: string;
  User: {
    username: string;
  };
}

interface User {
  username: string;
}

interface Spot {
  id: number;
  spotName: string;
  location: string;
  description: string;
  image: string;
  User: User;
  comments?: Comment[];
  likes: number;
  userLiked: boolean;
  updatedAt: string;
}

export function Spots({ spotId }: { spotId?: string }) {
  const [spotsData, setSpotsData] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [id: number]: boolean }>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{
    [id: number]: boolean;
  }>({});
  const [commentsData, setCommentsData] = useState<{ [id: number]: Comment[] }>(
    {}
  ); // Store comments for each spot

  // Fetch spots or a specific spot based on the spotId
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(
          spotId
            ? `http://localhost:3001/spots/${spotId}` // Fetch a specific spot
            : `http://localhost:3001/spots` // Fetch all spots
        );
        const data = await response.json();

        // If fetching a single spot, wrap it in an array for consistent rendering
        const spotArray = spotId ? [data] : data;

        // Initialize likedPosts state based on the userLiked field from the backend
        const likedPostsState = spotArray.reduce((acc, spot) => {
          acc[spot.id] = spot.userLiked;
          return acc;
        }, {} as { [id: number]: boolean });

        setLikedPosts(likedPostsState);
        setSpotsData(spotArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching spots data:", error);
        setLoading(false);
      }
    };

    fetchSpots();
  }, [spotId]);

  // Fetch comments for a specific spot
  const fetchComments = async (spotId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/comments/${spotId}`);
      const comments = await response.json();
      setCommentsData((prev) => ({ ...prev, [spotId]: comments }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Function to handle like/unlike functionality
  const toggleLike = async (spotId: number) => {
    const isLiked = likedPosts[spotId];
    const url = `http://localhost:3001/spots/${spotId}/${
      isLiked ? "unlike" : "like"
    }`;

    try {
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1 }), // Replace with actual logged-in user ID
      });

      if (response.ok) {
        const { likes } = await response.json(); // Get updated likes count from server

        // Update like status and like count in the UI
        setSpotsData((prevSpots) =>
          prevSpots.map((spot) =>
            spot.id === spotId ? { ...spot, likes } : spot
          )
        );
        setLikedPosts((prev) => ({ ...prev, [spotId]: !isLiked }));
      } else {
        console.error("Error response from server:", response.statusText);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  // Function to toggle bookmark state for individual posts
  const toggleBookmark = (id: number) => {
    setBookmarkedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!spotsData.length) {
    return <p>No spots data available</p>;
  }

  return (
    <div>
      {spotsData.map((spot: Spot) => (
        <div
          key={spot.id}
          className="bg-gray-200 rounded-md shadow-md p-4 mb-4 max-w-sm mx-auto"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold mb-0">{spot.spotName}</p>
              <p className="mt-0">{spot.location}</p>
            </div>
            <button>
              <Image
                src="/icons/user.png"
                alt="Profile"
                width={48}
                height={48}
              />
            </button>
          </div>
          <div className="bg-gray-400 rounded-md mb-2 min-h-[200px] max-h-[500px] overflow-hidden">
            {spot.image && (
              <Image
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
              <span>{spot.likes}</span> {/* Display the like count */}
              {/* Comment counter */}
              <button>
                <Image
                  src="/icons/chat-box.png"
                  alt="Comment"
                  width={32}
                  height={32}
                />
              </button>
              <span>{commentsData[spot.id]?.length || 0}</span>{" "}
              {/* Display the comment count */}
            </div>
            <button onClick={() => toggleBookmark(spot.id)}>
              <Image
                src={
                  bookmarkedPosts[spot.id]
                    ? "/icons/bookmark-filled.png"
                    : "/icons/bookmark.png"
                }
                alt="Save"
                width={32}
                height={32}
              />
            </button>
          </div>
          <div>
            <p className="m-0 pt-2">
              <b>{spot.User?.username}</b> {spot.description}
            </p>
          </div>
          {/* Fetch and display comments */}
          <CommentPreview
            comments={
              commentsData[spot.id]?.map((comment) => ({
                commentText: comment.commentText,
                username: comment.User?.username, // Ensure you access the User object
              })) || []
            }
            onFetchComments={async () => {
              const response = await fetch(
                `http://localhost:3001/comments/${spot.id}`
              );
              const fetchedComments = await response.json();
              return fetchedComments.map((comment: Comment) => ({
                commentText: comment.commentText,
                username: comment.User.username,
              }));
            }}
            spotId={spot.id} // Pass the spotId here
          />
          <div className="mt-1 font-normal">
            {new Date(spot.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
