"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import show from "../../../public/icons/show.png";
import hide from "../../../public/icons/hide.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, // Dynamic URL
        { username, password },
        { withCredentials: true } // Enables cookies
      );
      if (response.status === 200) {
        router.push("/home"); // Redirect to home on success
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  // Handle guest login
  const handleGuestLogin = async () => {
    try {
      setError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/guest-login`, // Dynamic URL for guest login
        {},
        { withCredentials: true } // Enables cookies
      );
      if (response.status === 200) {
        router.push("/home"); // Redirect to home on success
      }
    } catch (err) {
      setError("Error logging in as guest. Please try again.");
    }
  };

  // Check if form is valid (both username and password must be filled)
  const isFormValid = () => {
    return username && password;
  };

  // Focus on the username input when the component mounts
  useEffect(() => {
    const usernameInput = document.getElementById("username");
    if (usernameInput) {
      (usernameInput as HTMLInputElement).focus();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-b from-blue-300 to-orange-200 flex flex-col items-center text-center">
        <Image
          src="/icons/icon-trans.png"
          alt="CaliGo"
          width={200}
          height={200}
          className="mt-4"
        />
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 w-80 mt-8 p-4 bg-white rounded-lg shadow-lg"
        >
          {error && <p className="text-red-500">{error}</p>}

          {/* Username input */}
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Image src={show} className="h-5 w-5" alt="show password" />
              ) : (
                <Image src={hide} className="h-5 w-5" alt="hide password" />
              )}
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 rounded mt-2 ${
              !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isFormValid()}
          >
            Log in
          </button>

          {/* Guest login button */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="bg-orange-400 text-white py-2 rounded mt-2"
          >
            Continue as Guest
          </button>

          <p className="text-sm mt-2">
            New Here?{" "}
            <a href="/signup" className="text-blue-600">
              Sign up
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
