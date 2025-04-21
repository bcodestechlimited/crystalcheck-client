import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuthActions, useAuthStore } from "../store/useAuthStore";
import Loader from "../components/Loader";

export default function RouteGuard() {
  const { user, isValidating } = useAuthStore();
  const { getUser } = useAuthActions();

  const navigate = useNavigate();

  useEffect(() => {
    getUser(navigate);
  }, []);

  if (isValidating) {
    return (
      <div className="mt-2">
        <Loader />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}
