"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../components/button";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

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
          <p className="mb-6 text-left">
            You’re about to embark on a journey to uncover hidden gems and
            explore breathtaking spots with a community of like-minded
            explorers.
          </p>
          <Button onClick={login}>
            Join the Adventure <ArrowCircleRightOutlinedIcon />
          </Button>

          {/* Custom Install Button */}
          {showInstallButton && (
            <Button onClick={installPWA} className="mt-4">
              Install App
            </Button>
          )}

          {/* iOS Instructions */}
          {isIos && (
            <div className="mt-4">
              <p>
                To install this app, tap the <strong>Share</strong> button and
                then select <strong>Add to Home Screen</strong>.
              </p>
            </div>
          )}
        </section>
        <footer className="flex justify-evenly items-center w-full bg-transparent mt-auto p-4">
          <a href="/legal" className="hover:underline">
            Legal
          </a>
          <a
            href="https://github.com/EricRisher/CaliGo"
            className="hover:underline"
          >
            v2.5
          </a>
          <a href="https://www.ericrisher.com" className="hover:underline">
            by <b>Eric Risher</b>
          </a>
        </footer>
      </main>
    </div>
  );
}
