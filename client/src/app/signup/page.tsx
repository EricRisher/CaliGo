"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "../../components/button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [error, setError] = useState<string | null>(null); // Track error messages
  const [email, setEmail] = useState<string>(""); // Track email input value for signup

  // Handle Login/Signup logic
const handleAuth = async () => {
  const usernameElement = document.querySelector(
    "#username"
  ) as HTMLInputElement | null;
  const passwordElement = document.querySelector(
    "#password"
  ) as HTMLInputElement | null;
  const emailElement = document.querySelector(
    "#email"
  ) as HTMLInputElement | null;

  if (!usernameElement || !passwordElement) {
    setError("Username or Password input is missing");
    return;
  }

  const username = usernameElement.value.trim();
  const password = passwordElement.value.trim();
  const email = emailElement?.value.trim(); // Get the email if it exists

  if (!username || !password || (!isLogin && !email)) {
    setError("All fields are required for signup");
    return;
  }

  const bodyData = isLogin
    ? { username, password }
    : { username, password, email }; // Send email during signup

  console.log("Request Body:", bodyData); // Log the body data

  const endpoint = isLogin
    ? "http://localhost:3001/auth/login"
    : "http://localhost:3001/auth/signup";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Expected JSON but got something else");
    }

    const data = await response.json();

    if (response.ok) {
      console.log("Success:", data);
      window.location.href = "/home";
    } else {
      setError(data.error || "Authentication failed");
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    setError("Error during authentication");
  }
};


  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-b from-blue-300 to-orange-200 flex flex-col items-center justify-center text-center">
        <Image
          src="/icons/icon-trans.png"
          alt="CaliGo"
          width={200}
          height={200}
          className="logo"
        />

        <section className="max-w-lg mb-12 m-4">
          {/* Google Login Button */}
          <Button className="bg-gray-200 text-black py-3">
            Log In with Google
          </Button>

          <p className="text-lg font-light">or</p>

          {/* Toggle between Login and Signup */}
          <Button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null); // Clear errors when toggling
            }}
            className="w-full text-black py-4 rounded-md"
          >
            {isLogin ? "First time here?" : "Have an account?"}
          </Button>

          {/* Display error if exists */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Username Input */}
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 mt-4 bg-gray-200 text-black rounded-md mb-4"
          />

          {/* Email Input - Only show if signing up */}
          {!isLogin && (
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-200 text-black rounded-md mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          {/* Password Input */}
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-md mb-4"
          />

          <div className="space-y-4">
            {/* Login or Signup Button */}
            <Button
              onClick={handleAuth}
              className="w-full text-black py-3 rounded-md"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            {/* Forgot Password Link */}
            {isLogin && (
              <a
                href="/reset-password"
                className="text-sm text-gray-500 hover:underline mt-2"
              >
                Forgot password?
              </a>
            )}

            {/* Continue as Guest */}
            <Button
              onClick={() => (window.location.href = "/home")}
              className=" text-black py-3 rounded-md"
            >
              Continue as Guest
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
