"use client";

import { useState } from "react";
import Image from "next/image";
import { CommentPreview } from "../components/commentPreview";

export function Post() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="bg-gray-300 rounded-md shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="font-bold mb-0">Sunset Cliff</p>
          <p className="mt-0">Laguna Beach, CA</p>
          <p className="text-sm">- Ericdotme</p>
        </div>
        <button>
          <Image src="/icons/user.png" alt="Profile" width={48} height={48} />
        </button>
      </div>
      <div className="bg-gray-400 h-48 rounded-md mb-2"></div>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button onClick={toggleLike}>
            <Image
              src={isLiked ? "/icons/heart-filled.png" : "/icons/heart.png"}
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
        <button onClick={toggleBookmark}>
          <Image
            src={
              isBookmarked
                ? "/icons/bookmark-filled.png"
                : "/icons/bookmark.png"
            }
            alt="Save"
            width={32}
            height={32}
          />
        </button>
      </div>
      {/* Comment Preview */}
      <CommentPreview
        commentCount={15} // Replace with dynamic data
        previewText="Great view!" // Replace with dynamic data
        comments={[
          "Amazing spot!",
          "I love this place!",
          "Definitely visiting here.",
          "Beautiful!",
        ]} // Replace with dynamic data
      />
    </div>
  );
}
