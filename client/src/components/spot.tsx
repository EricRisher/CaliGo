import { useState, useEffect } from "react";
import Image from "next/image";
import { CommentPreview } from "../components/commentPreview";

// Define interfaces for Spot, Comment, and User
interface Comment {
  content: string;
}

interface User {
  username: string;
}

interface Spot {
  id: number;
  spotName: string;
  location: string;
  image: string;
  User: User;
  comments: Comment[];
}

export function Spots() {
  const [spotsData, setSpotsData] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [id: number]: boolean }>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{
    [id: number]: boolean;
  }>({});

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
          className="bg-gray-300 rounded-md shadow-md p-4 mb-4 max-w-sm mx-auto"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="font-bold mb-0">{spot.spotName}</p>
              <p className="mt-0">{spot.location}</p>
              <p className="text-sm">- {spot.User?.username}</p>
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
          <div className="flex justify-between items-center mt-2">
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
          <CommentPreview
            commentCount={spot.comments?.length || 0}
            previewText={spot.comments?.[0]?.content || "No comments yet"}
            comments={
              spot.comments?.map((comment: Comment) => comment.content) || []
            }
          />
        </div>
      ))}
    </div>
  );
}
