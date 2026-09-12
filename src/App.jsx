import React, { useState, useEffect } from "react";
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
import EditListing from "./Pages/EditListing";

function AppContent() {
  const lastTrackedPath = useRef(null);

  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  // ✅ Track page views on every route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  useEffect(() => {
    // ✅ Only track if the path actually changed
    if (lastTrackedPath.current !== location.pathname) {
      lastTrackedPath.current = location.pathname;
      trackPageView(location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          {/* ✅ Catch-all route — redirects to home if no match */}
          <Route path="*" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/edit/:token" element={<EditListing />} />
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
// import React from "react";
// import Submit from "./Pages/Submit";
// import Admin from "./Pages/Admin";
// import Navbar from "./Components/Navbar";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />

//         <main className="py-8">
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <div className="text-center text-gray-500">
//                   Homepage coming soon...
//                 </div>
//               }
//             />
//             <Route path="/submit" element={<Submit />} />
//             <Route path="/admin" element={<Admin />} />
//           </Routes>
//         </main>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
