"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CommentPreview } from "../../../components/commentPreview";
import EditSpotForm from "../../../components/editSpotForm";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navbar";

interface Comment {
  id: number;
  commentText: string;
  commentAuthor: {
    id: number;
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

export default function SpotDetail() {
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await fetch(`${apiUrl}/spots/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch spot: ${response.statusText}`);
        }

        const data: Spot = await response.json();
        setSpot(data);
        setLiked(data.userLiked);
      } catch (error) {
        console.error("Error fetching spot:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpot();
    }
  }, [id]);

  const toggleLike = async () => {
    if (!spot) return;
    const url = `${apiUrl}/spots/${spot.id}/${liked ? "unlike" : "like"}`;

    try {
      setLiked(!liked);
      const response = await fetch(url, {
        method: liked ? "DELETE" : "POST",
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

  if (!spot) {
    return <p>Spot not found</p>;
  }

  return (
    <div className="spot bg-gray-200 rounded-md shadow-md p-4 mb-4 sm:max-w-sm md:max-w-lg mx-auto">
      <Header />
      <div className="flex justify-between items-center relative mt-[82px]">
        <div>
          <p className="font-bold mb-0">{spot.spotName}</p>
          <p className="mt-0">{spot.location}</p>
        </div>
        <Image
          src={"/icons/menu.png"}
          alt="Menu"
          width={20}
          height={20}
          className="cursor-pointer"
        />
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
          <button onClick={toggleLike}>
            <Image
              src={liked ? "/icons/heart-filled.png" : "/icons/heart.png"}
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
          spot.comments?.map((comment) => ({
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
      <Navigation />
    </div>
  );
}
