"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapSection() {
  return (
    <div
      style={{
        flex: 1,
        height: "700px",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Map />
    </div>
  );
}