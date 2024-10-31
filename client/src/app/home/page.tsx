"use client";

import { Header } from "../../components/header";
import { Spots } from "../../components/spot";
import { Navigation } from "../../components/navbar";
import ProtectedPage from "@/components/ProtectedPage";

export default function HomePage() {
  return (
    <ProtectedPage>
    <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
      <Header />
      <main className="flex-grow p-4 py-[100px]">
        <Spots />
      </main>
      <Navigation />
    </div>
    </ProtectedPage>
  );
}
