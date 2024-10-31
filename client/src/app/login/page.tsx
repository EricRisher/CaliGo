"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await axios.post(
        "http://localhost:3001/auth/login", // Express URL
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
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 w-80 mt-8 p-4 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold">Login to CaliGo</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            className="p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded mt-2"
          >
            Login
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
