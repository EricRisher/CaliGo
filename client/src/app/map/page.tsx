"use client";

import CustomMap from "../../components/map";
import { Navigation } from "../../components/navbar";
import { Header } from "../../components/header";

export default function MapPage() {
  return (
    <div className="relative">
      <Header />
      <CustomMap spots={[]} />
      <Navigation />
    </div>
  );
}
