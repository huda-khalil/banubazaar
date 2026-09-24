import React, { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Landing from "./Pages/Landing";
import Home from "./Pages/Home";
import Submit from "./Pages/Submit";
import Admin from "./Pages/Admin";
import ListingDetail from "./Pages/ListingDetail";
import { Analytics } from "@vercel/analytics/react";
import { trackPageView } from "./lib/analytics";
import Contact from "./Pages/Contact";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminLogin from "./Pages/AdminLogin";
import About from "./Pages/About";
import Terms from "./Pages/Terms";
import ByAfghanWomen from "./Pages/ByAfghanWomen";
import EditListing from "./Pages/EditListing";

// ✅ Set to true to show "Under Construction" on all pages
// ✅ Set to false to bring the site back online
const UNDER_CONSTRUCTION = true;

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  const lastTrackedPath = useRef(null);

  // ✅ Track page views on every route change
  useEffect(() => {
    if (lastTrackedPath.current !== location.pathname) {
      lastTrackedPath.current = location.pathname;
      trackPageView(location.pathname);
    }
  }, [location.pathname]);

  // ✅ Under Construction screen
  if (UNDER_CONSTRUCTION) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">💟</div>
          <h1 className="text-3xl font-bold text-pink-600 mb-3">BanuBazaar</h1>
          <p className="text-lg text-gray-700 mb-2">We'll be back soon</p>
          <p className="text-sm text-gray-500">
            The site is currently under maintenance.
          </p>
          <div className="mt-8 text-xs text-gray-400">
            Thank you for your patience
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/afghan-women" element={<ByAfghanWomen />} />
          <Route path="/edit/:token" element={<EditListing />} />
          <Route path="/listing/:id" element={<ListingDetail />} />

          {/* Login route — must come BEFORE /admin */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
