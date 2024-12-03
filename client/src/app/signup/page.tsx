"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import show from "../../../public/icons/show.png";
import hide from "../../../public/icons/hide.png";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [passwordError, setPasswordError] = useState<string | null>(null); // State to manage password validation error
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const router = useRouter();

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

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Regex to validate password strength

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If password is invalid, show error and don't submit the form
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    try {
      setError(null);
      setPasswordError(null);
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Validate password on each change
    setRequirements({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
    });
  };

  const isFormValid = () => {
    return (
      email &&
      username &&
      passwordRegex.test(password) && // Check if the password matches the regex
      requirements.length &&
      requirements.uppercase &&
      requirements.lowercase &&
      requirements.number
    );
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
            autoFocus
          />
          <input
            type="text"
            placeholder="Username"
            className="p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded w-full pr-10"
              value={password}
              onChange={handlePasswordChange} // Handle password change and validation
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

          {/* List of password requirements */}
          <ul className="text-left text-sm">
            <li
              className={
                requirements.length ? "text-green-500" : "text-red-500"
              }
            >
              Minimum 8 characters
            </li>
            <li
              className={
                requirements.uppercase ? "text-green-500" : "text-red-500"
              }
            >
              At least one uppercase letter
            </li>
            <li
              className={
                requirements.lowercase ? "text-green-500" : "text-red-500"
              }
            >
              At least one lowercase letter
            </li>
            <li
              className={
                requirements.number ? "text-green-500" : "text-red-500"
              }
            >
              At least one number
            </li>
          </ul>

          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 rounded mt-2 ${
              !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isFormValid()}
          >
            Sign Up
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
