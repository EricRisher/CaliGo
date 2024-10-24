"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

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

        <header className="mt-8">
          <SignIn afterSignInUrl="/home" routing="hash" />
        </header>
      </main>
    </div>
  );
}
