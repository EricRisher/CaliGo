"use client";

import Image from "next/image";
import Button from "../components/button";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

export default function Home() {
  const signUp = () => {
    window.location.href = "/signup";
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
        <section className="max-w-lg mb-12">
          <h1 className="mb-4">Discover the West Coast like never before!</h1>
          <p className="mb-6">
            You’re about to embark on a journey to uncover hidden gems and
            explore breathtaking spots with a community of like-minded
            explorers.
          </p>
          <Button onClick={signUp}>
            Join the Adventure <ArrowCircleRightOutlinedIcon />
          </Button>
        </section>
        <footer className="flex justify-evenly items-center w-full bg-transparent mt-auto p-4">
          <a href="https://www.ericrisher.com" className=" hover:underline">
            by Eric Risher
          </a>
          <a href="/legal" className=" hover:underline">
            Legal
          </a>
          <a
            href="https://github.com/EricRisher/CaliGo"
            className=" hover:underline"
          >
            v1.0.0
          </a>
        </footer>
      </main>
    </div>
  );
}
