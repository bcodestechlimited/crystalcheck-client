import React from "react";
import Topbar from "../components/Topbar/Topbar";
import { Outlet } from "react-router-dom";

export default function TopBarLayout() {
  return (
    <div className="overflow-hidden w-full">
      <div className="flex-1 min-h-dvh">
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
