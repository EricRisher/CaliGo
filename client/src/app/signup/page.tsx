"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "../../components/button";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    const usernameElement = document.querySelector(
      "#username"
    ) as HTMLInputElement | null;
    const passwordElement = document.querySelector(
      "#password"
    ) as HTMLInputElement | null;

    if (!usernameElement || !passwordElement) {
      console.error("Username or Password input is missing");
      return;
    }

    const username = usernameElement.value;
    const password = passwordElement.value;
    const endpoint = "/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = response.headers.get("content-type");

      // Check if the response is JSON
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Expected JSON but got something else");
      }

      const data = await response.json();

      if (response.ok) {
        console.log("Success:", data);
        window.location.href = "/home";
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
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
          <Button className="bg-gray-200 text-black py-3">
            Log In with Google
          </Button>

          <p className="text-lg font-light">or</p>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-black py-4 rounded-md"
          >
            {isLogin ? "Have an account?" : "First time here?"}
          </Button>

          <input
            id="username"
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 mt-4 bg-gray-200 text-black rounded-md mb-4"
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-md mb-4"
          />

          <div className="space-y-4">
            <Button
              onClick={handleAuth}
              className="w-full text-black py-3 rounded-md"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <a
              href="/forgot-password"
              className="text-sm text-gray-500 hover:underline mt-2"
            >
              forgot password
            </a>
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
