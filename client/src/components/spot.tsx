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

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/spots`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch spots: ${response.statusText}`);
        }

        const data = await response.json();

        // Set spots data and like states
        setSpotsData(data);

        // Map initial liked states
        const initialLikedPosts = data.reduce(
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

    fetchSpots();
  }, [spotId]);

  const fetchComments = async (spotId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${spotId}`
      );
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
     // Optimistically update UI
     setLikedPosts((prev) => ({ ...prev, [spotId]: !isLiked }));
     setSpotsData((prevSpots) =>
       prevSpots.map((spot) =>
         spot.id === spotId
           ? { ...spot, likes: isLiked ? spot.likes - 1 : spot.likes + 1 }
           : spot
       )
     );

     // Send request to backend
     const response = await fetch(url, {
       method: isLiked ? "DELETE" : "POST",
       headers: { "Content-Type": "application/json" },
       credentials: "include",
     });

     if (!response.ok) {
       console.error("Failed to toggle like:", response.statusText);

       // Revert optimistic update if backend fails
       setLikedPosts((prev) => ({ ...prev, [spotId]: isLiked }));
       setSpotsData((prevSpots) =>
         prevSpots.map((spot) =>
           spot.id === spotId
             ? { ...spot, likes: isLiked ? spot.likes + 1 : spot.likes - 1 }
             : spot
         )
       );
     }
   } catch (error) {
     console.error("Error toggling like:", error);

     // Revert optimistic update in case of error
     setLikedPosts((prev) => ({ ...prev, [spotId]: isLiked }));
     setSpotsData((prevSpots) =>
       prevSpots.map((spot) =>
         spot.id === spotId
           ? { ...spot, likes: isLiked ? spot.likes + 1 : spot.likes - 1 }
           : spot
       )
     );
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
          className="spot bg-gray-200 rounded-md shadow-md p-4 mb-4 sm:max-w-sm md:max-w-lg mx-auto"
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
