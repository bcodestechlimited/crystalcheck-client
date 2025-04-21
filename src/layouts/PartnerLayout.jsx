import React from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function PartnerLayout() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const partner = pathParts[2]; // Partner name is at the third part of the URL

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-primary text-white py-6">
        <h1 className="text-2xl font-bold text-center capitalize">
          Partner: {partner ? partner.toUpperCase() : ""}
        </h1>
      </header>
      <Outlet />
    </div>
  );
}
