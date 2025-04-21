import React from "react";
import verification from "../../assets/images/CCI.png";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Crystal Checks</h1>
      <img src={verification} alt="" className="w-full" />
    </div>
  );
}
