"use client";

import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";

type CommentPreviewProps = {
  comments: { commentText: string; username: string }[];
  onFetchComments: () => Promise<{ commentText: string; username: string }[]>;
  spotId: number;
  isActive: boolean;
  setActivePreview: React.Dispatch<React.SetStateAction<number | null>>;
};

export function CommentPreview({
  comments,
  onFetchComments,
  spotId,
  isActive,
  setActivePreview,
}: CommentPreviewProps) {
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments);

  const fetchComments = async () => {
    try {
      const fetchedComments = await onFetchComments();
      setCommentList(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
      fetchComments(); // Fetch comments when the modal is opened
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  const handleViewAllComments = () => {
    setActivePreview(isActive ? null : spotId);
  };

  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewComment(e.target.value);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${spotId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ commentText: newComment }),
        }
      );

      if (!response.ok) throw new Error("Failed to submit comment");

      await fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <>
      <button onClick={handleViewAllComments} className="hover:underline">
        {isActive ? "Close Comments" : "Show Comments"}
      </button>

      {isActive && (
        <>
          {/* Overlay */}
          <div className="fixed-overlay"></div>

          {/* Modal */}
          <div className="fixed-modal">
            <div className="p-4 border-b">
              <button
                onClick={handleViewAllComments}
                className="text-gray-600 hover:underline"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              {commentList.length > 0 ? (
                commentList.map((comment, index) => (
                  <p key={index} className="text-sm">
                    <strong>{comment.username}:</strong> {comment.commentText}
                  </p>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <div className="p-4 border-t">
              <form onSubmit={handleCommentSubmit}>
                <input
                  type="text"
                  value={newComment}
                  onChange={handleNewCommentChange}
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-secondary text-white py-1 px-4 mt-2 rounded-lg hover:bg-blue-600"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
