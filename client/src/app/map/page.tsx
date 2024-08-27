"use client";

import dynamic from "next/dynamic";
import { Navigation } from "../../components/navbar";
import { Header } from "../../components/header";

const CustomMap = dynamic(() => import("../../components/map"), { ssr: false });

export default function MapPage() {
  return (
    <div className="relative">
      <Header />
      <CustomMap />
      <Navigation />
    </div>
  );
}
