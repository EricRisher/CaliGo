"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation"; // For handling params and navigation

// ResetPasswordPage Component
const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams(); // Get the reset token from the URL
  const router = useRouter(); // For navigation after successful password reset

  const handlePasswordReset = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await fetch(`/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        alert("Password has been successfully reset!");
        router.push("/login"); // Redirect to login page or another page after success
      } else {
        alert("Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <form onSubmit={handlePasswordReset}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your new password"
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

// Home Component
export default function Home() {
  return (
    <div className="flex flex-col min-h-90">
      <main className="flex-grow bg-gradient-to-b from-blue-300 to-orange-200 flex flex-col items-center justify-center text-center">
        {/* You can render ResetPasswordPage here or in a separate route */}
        <ResetPasswordPage />

        <footer className="flex justify-evenly items-center w-full bg-transparent mt-auto p-4">
          <a href="https://www.ericrisher.com" className="hover:underline">
            by Eric Risher
          </a>
          <a href="/legal" className="hover:underline">
            Legal
          </a>
          <a
            href="https://github.com/EricRisher/CaliGo"
            className="hover:underline"
          >
            v1.0.0
          </a>
        </footer>
      </main>
    </div>
  );
}
