"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "../../components/navbar";
import { Header } from "../../components/header";
import { AddSpotForm } from "../../components/addSpotForm"; // Named import
import ProtectedPage from "@/components/ProtectedPage";
import dynamic from "next/dynamic";
import axios from "axios";

// Define the Spot interface that matches your Sequelize model
interface Spot {
  id: number;
  spotName: string;
  latitude: number;
  longitude: number;
  image: string;
}

const CustomMap = dynamic(() => import("@/components/map"), { ssr: false });

export default function MapPage() {
  const [showForm, setShowForm] = useState(false);
  const [spots, setSpots] = useState<Spot[]>([]); // Use the Spot type here
  const pathname = usePathname(); // Get the current path

  // Fetch spots on page load
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/spots`
        );
        setSpots(response.data); // Store spots data in state
      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    };

    fetchSpots();
  }, []);

  // Listen for the custom event when "Add" button is clicked in Navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOpenForm = () => {
        setShowForm(true); // Show the form when event is dispatched
      };

      window.addEventListener("openAddSpotForm", handleOpenForm);

      // Cleanup the event listener when component unmounts
      return () => {
        window.removeEventListener("openAddSpotForm", handleOpenForm);
      };
    }
  }, []);

  useEffect(() => {
    // Automatically hide the form when navigating away from /map
    if (pathname !== "/map") {
      setShowForm(false);
    }
  }, [pathname]);

  return (
    <div className="relative">
      <Header />
      {/* Pass fetched spots data to the map component */}
      <CustomMap spots={spots} />

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
  );
}
