"use client";

import Image from "next/image";
import Button from "../../components/button";

export default function AuthPage() {
    const login = () => {
        window.location.href = "/login";
    };

    const signUp = () => {
        window.location.href = "/signup";
    };

    const guest = () => {
        window.location.href = "/home";
    }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-b from-blue-300 to-orange-200 flex flex-col items-center justify-center text-center">
        <Image
          src="/icons/icon-trans.png"
          alt="CaliGo"
          width={200}
          height={200}
          className="logo mb-8"
        />

        <section className="max-w-lg mb-12">
          <Button className="bg-gray-200 text-black py-3">
            Log In with Google
          </Button>

          <p className="text-lg font-light">or</p>

          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-200 text-black rounded-md"
          />

          <a
            href="/forgot-password"
            className="text-sm text-gray-500 hover:underline mt-2"
          >
            forgot password
          </a>

          <div className="space-y-4">
            <Button onClick={login} className="w-full  text-black py-3 rounded-md">
              Login
            </Button>
            <Button onClick={signUp} className="w-full  text-black py-3 rounded-md">
              Sign Up
            </Button>
            <Button onClick={guest}>
                Continue as Guest
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
