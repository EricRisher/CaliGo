"use client";

import { Header } from "../../components/header";
import { Spots } from "../../components/spot";
import { Navigation } from "../../components/navbar";
import ProtectedPage from "@/components/ProtectedPage";

export default function HomePage() {
  return (
    // <ProtectedPage>
    <div className="flex flex-col min-h-screen bg-gray-200 home-page">
      <Header />
      <main className="flex-grow py-[80px]">
        <Spots />
      </main>
      <Navigation />
    </div>
    //  </ProtectedPage>
  );
}
