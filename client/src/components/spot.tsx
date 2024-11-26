"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CommentPreview } from "../components/commentPreview";

// Define interfaces for Spot, Comment, and User
interface Comment {
  commentText: string;
  commentAuthor: {
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
  commentCount?: number;
  likes: number;
  userLiked: boolean;
  updatedAt: string;
  creator: User;
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
  );

  const userId = 1; // Example user ID, replace with actual logged-in user ID

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(
          spotId ? `${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}` : `${process.env.NEXT_PUBLIC_API_URL}/spots`
        );
        const data = await response.json();
        const spotArray = spotId ? [data] : data;

        const likedPostsState = spotArray.reduce(
          (acc: { [id: number]: boolean }, spot: Spot) => {
            acc[spot.id] = spot.userLiked;
            return acc;
          },
          {} as { [id: number]: boolean }
        );

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

  const fetchComments = async (spotId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${spotId}`);
      const comments = await response.json();
      setCommentsData((prev) => ({
        ...prev,
        [spotId]: Array.isArray(comments) ? comments : [],
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleLike = async (spotId: number) => {
    const isLiked = likedPosts[spotId];
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spots/${spotId}/${
      isLiked ? "unlike" : "like"
    }`;

    try {
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure credentials are sent
        body: JSON.stringify({ userId }), // Assuming you are sending userId as part of the request
      });

      if (response.ok) {
        const { likes } = await response.json();
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
              <button>
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
                hidden={true}
              />
            </button>
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
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/comments/${spot.id}`
              );
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
