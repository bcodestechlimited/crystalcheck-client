import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh bg-sky-50 p-4 gap-4">
      {/* Sidebar */}
      <div className="w-2/5 max-w-fit bg-white border border-gray-200 rounded-lg p-3 max-h-dvh">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="w-full flex flex-col">
        {/* Content area */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
