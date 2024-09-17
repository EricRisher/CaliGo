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
  date: string;
  updatedAt: string;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export function Spots() {
  const [spotsData, setSpotsData] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [id: number]: boolean }>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{
    [id: number]: boolean;
  }>({});
  const [commentsData, setCommentsData] = useState<{ [id: number]: Comment[] }>(
    {}
  ); // Store comments for each spot

  // Fetch all spots
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`http://localhost:3001/spots`);
        const data: Spot[] = await response.json();
        setSpotsData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching spots data:", error);
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

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

  // Function to toggle like state for individual posts
  const toggleLike = (id: number) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
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
            <div className="flex space-x-4">
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
              <button>
                <Image
                  src="/icons/chat-box.png"
                  alt="Comment"
                  width={32}
                  height={32}
                />
              </button>
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
          {/* Fetch and display comments when clicking "View All Comments" */}
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
              return fetchedComments.map((comment) => ({
                commentText: comment.commentText,
                username: comment.User.username,
              }));
            }}
            spotId={spot.id} // Pass the spotId here
          />
          <div className="mt-1 font-normal">{formatDate(spot.updatedAt)}</div>
        </div>
      ))}
    </div>
  );
}
