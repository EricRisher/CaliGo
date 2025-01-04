"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../components/button";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

interface Spot {
  id: number;
  spotName: string;
  latitude: number;
  longitude: number;
  city: string;
  image: string;
}

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [spotCount, setSpotCount] = useState(0);

  // Handle "beforeinstallprompt" event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event
      setShowInstallButton(true); // Show the install button
    };

    const handleAppInstalled = () => {
      console.log("PWA installed");
      setShowInstallButton(false); // Hide the install button
    };

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIos(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    // Fetch spot count from the backend
    const fetchSpotCount = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/spots/spot-count`); // Adjust the URL to match your API endpoin

        const data = await response.json();
        setSpotCount(data.total); // Update state with the count
      } catch (error) {
        console.error("Error fetching spot count:", error);
      }
    };

    fetchSpotCount();
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt(); // Show the install prompt
      const { outcome } = await promptEvent.userChoice;
      console.log(
        outcome === "accepted"
          ? "PWA installation accepted"
          : "PWA installation dismissed"
      );
      setDeferredPrompt(null); // Clear the deferred prompt
    }
  };

  const login = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Set min-height of screen */}
      <main className="flex-grow bg-gradient-to-b from-blue-300 to-orange-200 flex flex-col items-center justify-center text-center min-h-screen">
        {/* Set min-height of screen */}
        <Image
          src="/icons/icon-trans.png"
          alt="CaliGo"
          width={200}
          height={200}
          className="mt-4"
        />
        <section className="max-w-90 m-4">
          <h1 className="mb-4">Discover the West Coast like never before!</h1>
          <p className="mb-6 text-lg">
            Embark on a journey to uncover hidden gems, explore breathtaking
            locations, and connect with fellow adventurers who share your
            passion for discovery.
          </p>
          <div className="flex flex-row justify-evenly flex-wrap">
            <Button onClick={login} className="mt-2">
              Start Exploring Now <ArrowCircleRightOutlinedIcon />
            </Button>
            {/* Custom Install Button */}
            {showInstallButton && (
              <Button onClick={installPWA} className="bg-orange-400 text-white mt-2">
                Install App
              </Button>
            )}
          </div>
          {/* iOS Instructions */}
          {isIos && (
            <div className="mt-4">
              <p>
                To install this app, tap the <strong>Share</strong> button and
                then select <strong>Add to Home Screen</strong>.
              </p>
            </div>
          )}

          {/* Hero Images */}
          <div className="text-left hero-text">
            <h2 className="mt-20">Explore. &nbsp; Share. &nbsp; Inspire.</h2>
            <h3 className="text-1xl tracking-wider">
              Over{" "}
              <span className="text-4xl font-bold text-black">{spotCount}</span>{" "}
              incredible spots shared by our community!
            </h3>
          </div>
          <section className="flex flex-row flex-wrap justify-evenly">
            <Image
              src={"/images/caligo.site_home (1).png"}
              alt="CaliGo"
              width={400}
              height={300}
              className="rounded-lg hero-images"
            />
            <Image
              src={"/images/caligo.site_home (2).png"}
              alt="CaliGo"
              width={400}
              height={300}
              className="rounded-lg hero-images"
            />
            <Image
              src={"/images/caligo.site_home.png"}
              alt="CaliGo"
              width={400}
              height={300}
              className="rounded-lg hero-images"
            />
            <Image
              src={"/images/caligo.site_home (3).png"}
              alt="CaliGo"
              width={400}
              height={300}
              className="rounded-lg hero-images"
            />
          </section>
        </section>
        <footer className="relative flex justify-evenly items-center w-full bg-transparent mt-auto p-4 flex-col">
          <h5>CaliGo - Your Adventure Starts Here</h5>
          <div>
            <a href="/legal" className="hover:underline">
              Legal
            </a>
            <a
              href="https://github.com/EricRisher/CaliGo"
              className="hover:underline"
            >
              Version 2.5
            </a>
            <a href="https://www.ericrisher.com" className="hover:underline">
              by <b>Eric Risher</b>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
