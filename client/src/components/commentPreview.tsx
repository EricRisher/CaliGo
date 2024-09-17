import React, { useState, useEffect } from "react";

type CommentPreviewProps = {
  comments: { commentText: string; username: string }[]; // Array of comments
  onFetchComments: () => Promise<{ commentText: string; username: string }[]>; // Function to fetch comments
  spotId: number; // Pass the spot ID to submit the comment to the right post
};

export function CommentPreview({
  comments,
  onFetchComments,
  spotId,
}: CommentPreviewProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState(""); // State to store the input for new comment
  const [commentList, setCommentList] = useState(comments); // Local state to store comments

  useEffect(() => {
    // When showAllComments is triggered, fetch comments from the backend
    if (showAllComments) {
      (async () => {
        try {
          const fetchedComments = await onFetchComments();
          setCommentList(fetchedComments); // Update commentList with fetched comments
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      })();
    }
  }, [showAllComments, onFetchComments]);

  const handleViewAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value); // Handle input change
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      // Post the new comment to the backend
      const response = await fetch(`http://localhost:3001/comments/${spotId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentText: newComment,
          userId: 1, // Change this to the correct logged-in user's ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const newCommentFromServer = await response.json();

      // Update local comment list with the new comment
      setCommentList((prevList) => [
        ...prevList,
        {
          commentText: newCommentFromServer.commentText,
          username: newCommentFromServer.User.username,
        },
      ]);

      setNewComment(""); // Reset input after submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div>
      <button onClick={handleViewAllComments} className="hover:underline mt-2">
        {showAllComments ? "Hide Comments" : "View All Comments"}
      </button>

      {showAllComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-end mb-[92px]">
          {/* Comment modal with fixed "Close" button and input field */}
          <div className="bg-white rounded-t-lg max-h-[80%] w-full flex flex-col">
            {/* Fixed "Close" button */}
            <div className="sticky top-0 p-4 bg-white z-10 border-b">
              <button
                onClick={handleViewAllComments}
                className="text-right text-gray-600 hover:underline"
              >
                Close
              </button>
            </div>

            {/* Scrollable comments section */}
            <div className="flex-grow overflow-y-auto p-4 max-h-[30vh]">
              {commentList.map((comment, index) => (
                <p key={index} className="text-sm">
                  <strong>{comment.username}:</strong> {comment.commentText}
                </p>
              ))}
            </div>

            {/* Fixed "Add a comment" input at the bottom */}
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
                  className="bg-blue-500 text-white py-1 px-4 mt-2 rounded-lg hover:bg-blue-600"
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
