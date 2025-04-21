import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login";
import RootLayout from "./layouts/RootLayout";
import { Toaster } from "sonner";
import Candidates from "./pages/Candidates/Candidates";
import Guarantors from "./pages/Guarantors/Guarantors"; // New import for Guarantors page
import FieldOfficers from "./pages/FieldOfficers/FieldOfficers";
import CandidateDetail from "./pages/CandidateDetail/CandidateDetail";
import RouteGuard from "./utils/RouteGuard";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound.jsx/NotFound";
import ICSLayout from "./layouts/ICSLayout";
import PartnerLayout from "./layouts/PartnerLayout";
import GuarantorDetail from "./pages/Guarantors/GuarantorDetail";
import Admin from "./pages/Admin/Admin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <RouteGuard />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/partners", // Directly use ICSLayout for /partners
            element: <PartnerLayout />,
            children: [
              {
                path: "/partners/ics", // /partners/ics route
                element: <ICSLayout />, // ICSLayout component for /partners/ics
                children: [
                  {
                    path: "/partners/ics/candidates", // /partners/ics/candidates route
                    element: <Candidates />, // Candidates component
                  },
                  {
                    path: "/partners/ics/guarantors", // /partners/ics/guarantors route
                    element: <Guarantors />, // Guarantors component
                  },
                ],
              },
              {
                path: "/partners/ics/candidates/:details",
                element: <CandidateDetail />,
              },
              {
                path: "/partners/ics/guarantors/:guarantorId",
                element: <GuarantorDetail />,
              },
            ],
          },
          {
            path: "/field-officers",
            element: <FieldOfficers />,
          },
          {
            path: "/admin",
            element: <Admin />,
          },
        ],
      },
    ],
  },
  {
    path: "*", // Catch-all route for unmatched paths
    element: <NotFound />, // Display the NotFound component
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
