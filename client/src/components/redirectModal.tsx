"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// This will be a simple modal component to notify users to sign up for full access
const GuestRedirectModal = ({ onClose }: { onClose: () => void }) => (
  <div className="modal">
    <div className="modal-content">
      <h2>Sign Up Required</h2>
      <p>
        To access full features like your profile and maps, please sign up for
        an account.
      </p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGuest, setIsGuest] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check the session or token to see if the user is a guest
    const token = localStorage.getItem("userToken"); // or use cookies/session for your setup
    const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

    if (user?.isGuest) {
      setIsGuest(true);
    }
  }, []);

  const handleAccessDenied = () => {
    setShowModal(true);
    // You could optionally redirect to the signup page here or just display the modal
  };

  if (isGuest) {
    return (
      <div>
        <div className="content">{children}</div>{" "}
        {/* Home feed or allowed content */}
        {showModal && (
          <GuestRedirectModal onClose={() => setShowModal(false)} />
        )}
        {/* Here, implement logic to show a prompt/modal on the screen */}
      </div>
    );
  }

  return (
    <div>
      <div className="content">{children}</div>
      {showModal && <GuestRedirectModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
