"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    setError(null);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, // Dynamic URL
      { email, username, password },
      { withCredentials: true } // Enables cookies
    );
    if (response.status === 201) {
      router.push("/login"); // Redirect to login on success
    }
  } catch (err) {
    setError("Error creating account. Please try again.");
  }
};

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
          onSubmit={handleSignup}
          className="flex flex-col gap-4 w-80 mt-8 p-4 bg-white rounded-lg shadow-lg"
        >
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
            Sign Up
          </button>
          <p className="text-sm mt-2">
            Been Here Before?{" "}
            <a href="/login" className="text-blue-600">
              Log in
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
