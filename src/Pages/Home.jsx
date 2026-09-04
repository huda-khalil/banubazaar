import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CATEGORIES = [
  "All",
  "Clothing",
  "Electronics",
  "Home Goods",
  "Books",
  "Other",
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredListings(listings);
    } else {
      setFilteredListings(
        listings.filter((item) => item.category === selectedCategory),
      );
    }
  }, [selectedCategory, listings]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
      setFilteredListings(data || []);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">🛍️ Browse Items</h2>
        <p className="text-gray-600">
          Find something you love from Kabul's women
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? "bg-pink-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading items...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">
            No items available in this category yet.
          </p>
          <Link
            to="/submit"
            className="text-pink-600 hover:underline mt-2 inline-block"
          >
            Be the first to sell! 🌸
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredListings.map((item) => (
            <Link
              to={`/listing/${item.id}`}
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden block hover:scale-[1.02]"
            >
              {item.images?.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 truncate">
                  {item.title}
                </h3>
                <p className="text-pink-600 font-bold text-xl mt-1">
                  {item.price} AFN
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.condition}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  📍 {item.seller_location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { supabase } from "../lib/supabase";

// export default function Home() {
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchListings();
//   }, []);

//   const fetchListings = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from("listings")
//         .select("*")
//         .eq("status", "approved")
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       setListings(data || []);
//     } catch (err) {
//       console.error("Error fetching listings:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold text-gray-800 mb-2">Browse Items</h2>
//       <p className="text-gray-600 mb-6">Find what you're looking for</p>

//       {loading ? (
//         <div className="text-center py-12 text-gray-500">Loading items...</div>
//       ) : listings.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
//           <p className="text-gray-500">No items available yet</p>
//           <Link
//             to="/submit"
//             className="text-pink-600 hover:underline mt-2 inline-block"
//           >
//             Be the first to sell!
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {listings.map((listing) => (
//             <div
//               key={listing.id}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
//             >
//               {listing.images && listing.images.length > 0 ? (
//                 <img
//                   src={listing.images[0]}
//                   alt={listing.title}
//                   className="w-full h-48 object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
//                   No image
//                 </div>
//               )}
//               <div className="p-4">
//                 <h3 className="font-semibold text-lg text-gray-800 truncate">
//                   {listing.title}
//                 </h3>
//                 <p className="text-pink-600 font-bold text-xl">
//                   {listing.price} AFN
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {listing.category} • {listing.condition}
//                 </p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   📍 {listing.seller_location}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
