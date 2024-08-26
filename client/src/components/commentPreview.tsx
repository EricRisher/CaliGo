"use client";

import { useState } from "react";

type CommentPreviewProps = {
  commentCount: number;
  previewText: string;
  comments: string[]; // Array of all comments
};

export function CommentPreview({
  commentCount,
  previewText,
  comments,
}: CommentPreviewProps) {
  const [showAllComments, setShowAllComments] = useState(false);

  const handleViewAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold">{commentCount} Comments</p>
      <p className="text-sm italic truncate">&quot;{previewText}&quot;</p>
      <button
        onClick={handleViewAllComments}
        className="text-blue-500 hover:underline mt-2"
      >
        {showAllComments ? "Hide Comments" : "View All Comments"}
      </button>

      {showAllComments && (
        <div className="mt-4 space-y-2 transition-all duration-300 ease-in-out">
          {comments.map((comment, index) => (
            <p key={index} className="text-sm">
              {comment}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
