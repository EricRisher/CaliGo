"use client";

import { useParams } from "next/navigation";
import { Header } from "../../../components/header";
import { Spots } from "../../../components/spot";
import { Navigation } from "../../../components/navbar";

export default function SpotDetail() {
  const { id } = useParams(); // Get the dynamic ID from the route

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
      <Header />
      <main className="flex-grow p-4 py-[100px]">
        <Spots spotId={Array.isArray(id) ? id[0] : id} />
      </main>
      <Navigation />
    </div>
  );
}
