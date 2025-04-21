import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function ICSLayout() {
  return (
    <div className="bg-[#F3FAFF]">
      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-center my-6">
        <NavLink
          to="/partners/ics/candidates"
          className="bg-primary text-white p-2 rounded-md"
        >
          Candidates
        </NavLink>
        <NavLink
          to="/partners/ics/guarantors"
          className="bg-primary text-white p-2 rounded-md"
        >
          Guarantors
        </NavLink>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
