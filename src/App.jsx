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

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  // ✅ Track page views on every route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
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
