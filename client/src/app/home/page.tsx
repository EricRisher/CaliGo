"use client";

import { Header } from "../../components/header";
import { Spots } from "../../components/spot";
import { Navigation } from "../../components/navbar";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-4 py-[100px]">
        <Spots />
      </main>
      <Navigation />
    </div>
  );
}
