/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { Header } from "@/components/header";
import ImageUploadForm from "@/components/ImageUploadForm";
import { Navigation } from "@/components/navbar";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import axios from "axios";

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
  userSaved: boolean;
  updatedAt: string;
  creator: User;
}

export default function SpotDetail() {
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [id: number]: boolean }>({});
  const [savedPosts, setSavedPosts] = useState<{ [id: number]: boolean }>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [images, setImages] = useState<
    { id: number; url: string; uploaderId: number }[]
  >([]); // Array of image objects
  const [showImageForm, setShowImageForm] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

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
        setLikedPosts((prev) => ({ ...prev, [data.id]: data.userLiked }));
        setSavedPosts((prev) => {
          const updatedState = { ...prev, [data.id]: data.userSaved };
          return updatedState;
        });
      } catch (error) {
        console.error("Error fetching spot:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/spots/${id}/save`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setIsSaved(data.isSaved);
        }
      } catch (error) {
        console.error("Error fetching saved status:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiUrl}/comments/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const fetchSpotImages = async () => {
      try {
        const response = await fetch(`${apiUrl}/spots/${id}/images`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch spot images");
        }
        const data: { id: number; url: string; uploaderId: number }[] =
          await response.json();
        setImages(data); // Update the gallery
      } catch (error) {
        console.error("Error fetching spot images:", error);
      }
    };

    // Call all fetch functions
    fetchSpot();
    fetchComments();
    fetchSavedStatus();
    fetchSpotImages();
  }, [id, apiUrl]);

  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/comments/${spot?.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ commentText: newComment }),
      });
      if (response.ok) {
        const addedComment: Comment = await response.json();
        setComments((prev) => [...prev, addedComment]);
        setNewComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleSave = async () => {
    if (!spot) return;

    const spotId = spot.id;
    const isCurrentlySaved = savedPosts[spotId];
    const url = `${apiUrl}/spots/${spotId}/${
      isCurrentlySaved ? "unsave" : "save"
    }`;

    try {
      // Optimistic update
      setSavedPosts((prev) => {
        const updatedState = { ...prev, [spotId]: !isCurrentlySaved };
        return updatedState;
      });

      setSpot((prevSpot) => {
        const updatedSpot = prevSpot
          ? { ...prevSpot, userSaved: !isCurrentlySaved }
          : prevSpot;
        return updatedSpot;
      });

      const response = await fetch(url, {
        method: isCurrentlySaved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle save");
      }
    } catch (error) {
      console.error("Error toggling save:", error);

      // Revert UI changes on error
      setSavedPosts((prev) => ({ ...prev, [spotId]: isCurrentlySaved }));
      setSpot((prevSpot) =>
        prevSpot ? { ...prevSpot, userSaved: isCurrentlySaved } : prevSpot
      );
    }
  };
  const toggleLike = async () => {
    if (!spot) return;

    const spotId = spot.id;
    const isLiked = likedPosts[spotId];
    const url = `${apiUrl}/spots/${spotId}/${isLiked ? "unlike" : "like"}`;

    setLikedPosts((prev) => ({ ...prev, [spotId]: !isLiked }));
    setSpot((prevSpot) =>
      prevSpot
        ? { ...prevSpot, likes: prevSpot.likes + (isLiked ? -1 : 1) }
        : prevSpot
    );

    try {
      const response = await fetch(url, {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setLikedPosts((prev) => ({ ...prev, [spotId]: isLiked }));
      setSpot((prevSpot) =>
        prevSpot
          ? { ...prevSpot, likes: prevSpot.likes + (isLiked ? 1 : -1) }
          : prevSpot
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!spot) return <p>Spot not found</p>;

  const shareSpot = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard");
  };

  const deleteImage = async (imageId: number) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/spots/${spot?.id}/images/${imageId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Image deleted successfully.");
        setImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        );
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Unable to delete image. Please try again.");
    }
  };

  const toggleImageForm = () => {
    setShowImageForm(!showImageForm);
  };

  const fetchSpotImages = async () => {
    try {
      const response = await fetch(`${apiUrl}/spots/${id}/images`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch spot images");
      }
      const data: { id: number; url: string; uploaderId: number }[] =
        await response.json();
      setImages(data); // Update the gallery
    } catch (error) {
      console.error("Error fetching spot images:", error);
    }
  };

  const handleUploadSuccess = () => {
    fetchSpotImages(); // Refresh the gallery after successful upload
    setShowImageForm(false); // Optionally close the form after upload
  };

  return (
    <div className="container spot-info mx-auto mb-[100px] mt-[80px]">
      <Header />
      <div className="wrapper flex flex-col items-center relative">
        <button
          onClick={() => (window.location.href = `/home`)}
          className="absolute top-0 left-0 p-2 z-10"
        >
          <Image
            src="/icons/back.png"
            alt="Back"
            className="cursor-pointer opacity-50 hover:opacity-100"
            width={28}
            height={28}
          />
        </button>
        <div className="w-full relative">
          <img
            src={spot.image}
            alt={spot.spotName}
            className="spot-image w-full object-cover content"
          />
          <span className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black to-transparent w-full  ">
            <h2 className="text-white mb-0">{spot.spotName}</h2>
            <h6 className="text-white mb-0">{spot.location}</h6>
          </span>
        </div>
      </div>
      <div className="flex flex-row p-2 justify-start border-b-2 border-black-200">
        <button
          onClick={toggleImageForm}
          className="flex flex-row p-2 justify-end"
        >
          Add Photos
        </button>
        {/* <button onClick={viewImages} className="flex flex-row p-2 justify-end">
          View Images
        </button> */}
        <button onClick={shareSpot} className="flex flex-row p-2 justify-end">
          Share
        </button>
      </div>
      <div className="flex flex-row justify-start p-2">
        <button onClick={toggleLike} className="flex flex-row p-2 justify-end">
          <Image
            src={
              likedPosts[spot.id]
                ? "/icons/heart-filled.png"
                : "/icons/heart.png"
            }
            alt="Like"
            width={32}
            height={32}
            className="mr-2"
          />
        </button>
        <button className="flex flex-row p-2 justify-end">
          <Image
            src="/icons/chat-box.png"
            alt="Comment"
            width={32}
            height={32}
            className="mr-2"
          />
          <span>{spot.commentCount}</span>
        </button>
        <button onClick={toggleSave} className="flex flex-row p-2 justify-end">
          <Image
            src={
              savedPosts[spot.id]
                ? "/icons/bookmark-filled.png"
                : "/icons/bookmark.png"
            }
            alt={savedPosts[spot.id] ? "Unsave" : "Save"}
            width={32}
            height={32}
            className="mr-2"
          />
        </button>
      </div>

      <div className="flex flex-col justify-start px-4 flex-wrap">
        <p className="m-0">
          <b>{spot.creator?.username} •</b> {spot.description}
        </p>
      </div>
      {/* Spot Image Gallery */}
      <div className="p-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="mb-0">Gallery</h2>
            <div className="flex flex-row">
              <button onClick={toggleImageForm} className="p-2 mr-2">
                Add Photos
              </button>
              <button
                onClick={() => setIsEditMode((prev) => !prev)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                {isEditMode ? "Done" : "Edit"}
              </button>
            </div>
        </div>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative w-full max-h-40 rounded-lg overflow-hidden"
              >
                <img
                  src={image.url} // Ensure correct path to the backend image URL
                  alt={`Spot Image ${image.id}`}
                  className="rounded-lg"
                />
                {isEditMode && (
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 opacity-75 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No images added yet.</p>
        )}
      </div>
      <div className="p-4 flex flex-col justify-start">
        <h3 className="mt-6">Comments</h3>
        {comments.map((comment, index) => (
          <p key={index}>
            <b>{comment.commentAuthor.username}:</b> {comment.commentText}
          </p>
        ))}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="w-full p-2 border rouded-lg "
        />
        <button
          onClick={postComment}
          className="text-center p-1 mt-4 bg-secondary w-20 text-white rounded-lg text"
        >
          Post
        </button>
      </div>
      <Navigation />

      {showImageForm && (
        <ImageUploadForm
          spotId={spot.id}
          apiUrl={process.env.NEXT_PUBLIC_API_URL || ""}
          onClose={toggleImageForm}
          onUploadSuccess={handleUploadSuccess} // Call this after successful upload
        />
      )}
    </div>
  );
}
