"use client";

import { Header } from "../../components/header";
import { Spots } from "../../components/spot";
import { Navigation } from "../../components/navbar";
import ProtectedPage from "@/components/ProtectedPage";

export default function HomePage() {
  return (
    // <ProtectedPage>
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow p-2 py-[20px]">
        <Spots />
      </main>
      <Navigation />
    </div>
    //  </ProtectedPage>
  );
}
