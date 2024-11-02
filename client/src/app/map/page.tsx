"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "../../components/navbar";
import { Header } from "../../components/header";
import { AddSpotForm } from "../../components/addSpotForm"; // Named import
import ProtectedPage from "@/components/ProtectedPage";

import CustomMap from "@/components/map";

export default function MapPage() {
  const [showForm, setShowForm] = useState(false);
  const pathname = usePathname(); // Get the current path

  // Listen for the custom event when "Add" button is clicked in Navigation
  useEffect(() => {
    const handleOpenForm = () => {
      setShowForm(true); // Show the form when event is dispatched
    };

    window.addEventListener("openAddSpotForm", handleOpenForm);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener("openAddSpotForm", handleOpenForm);
    };
  }, []);

  useEffect(() => {
    // Automatically hide the form when navigating away from /map
    if (pathname !== "/map") {
      setShowForm(false);
    }
  }, [pathname]); 

  return (
    <ProtectedPage>
    <div className="relative">
      <Header />
      <CustomMap />

      <div
        className={`fixed inset-x-0 bottom-0 bg-white p-4 shadow-lg transition-transform duration-300 z-[150] ${
          showForm ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <AddSpotForm closeForm={() => setShowForm(false)} />
      </div>

      <Navigation />
    </div>
    </ProtectedPage>
  );
}
