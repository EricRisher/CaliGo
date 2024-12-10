"use client";
import React, { useState, useEffect } from "react";

type CommentPreviewProps = {
  comments: { commentText: string; username: string }[];
  onFetchComments: () => Promise<{ commentText: string; username: string }[]>;
  spotId: number;
};

export function CommentPreview({
  comments,
  onFetchComments,
  spotId,
}: CommentPreviewProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments);

  // Unified function to fetch comments
  const fetchComments = async () => {
    try {
      const fetchedComments = await onFetchComments();
      setCommentList(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    // Fetch comments only when `showAllComments` is true
    if (showAllComments) {
      fetchComments();
    }
  }, [showAllComments]);

  const handleViewAllComments = () => setShowAllComments((prev) => !prev);

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

      await fetchComments(); // Refresh comments after posting a new one
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div>
      <button onClick={handleViewAllComments} className="hover:underline mt-2">
        {showAllComments ? "Close Comments" : "View All Comments"}
      </button>

      {showAllComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-end mb-[80px]">
          <div className="bg-white rounded-t-lg max-h-[80%] w-full flex flex-col">
            <div className="sticky top-0 p-4 bg-white z-10 border-b">
              <button
                onClick={handleViewAllComments}
                className="text-right text-gray-600 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 max-h-[30vh]">
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

            <div className="sticky bottom-0 p-4 bg-white border-t">
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
        </div>
      )}
    </div>
  );
}
