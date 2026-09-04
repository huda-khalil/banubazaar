import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Admin Password - CHANGE THIS!
  const ADMIN_PASSWORD = "banubazaar2025";

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("❌ Incorrect password");
    }
  };

  // Fetch pending listings
  const fetchPendingListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (err) {
      setError("Failed to fetch listings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve listing
  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setSuccess("✅ Listing approved!");
      fetchPendingListings(); // Refresh the list

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to approve: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Reject listing
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this listing?"))
      return;

    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;

      setSuccess("❌ Listing rejected");
      fetchPendingListings(); // Refresh the list

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to reject: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Delete listing (for spam)
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "⚠️ Permanently delete this listing? This cannot be undone!",
      )
    )
      return;

    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);

      if (error) throw error;

      setSuccess("🗑️ Listing deleted");
      fetchPendingListings(); // Refresh the list

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Load listings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingListings();
    }
  }, [isAuthenticated]);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-pink-600">🛍️ BanuBazaar</h1>
            <p className="text-gray-500 text-sm">Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter password..."
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-pink-600">
              🛍️ BanuBazaar Admin
            </h1>
            <p className="text-sm text-gray-500">Manage listings</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-500 hover:text-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              📋 Pending Listings: <strong>{listings.length}</strong>
            </span>
            <button
              onClick={fetchPendingListings}
              className="text-pink-600 hover:text-pink-800 text-sm"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading pending listings...
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <p className="text-gray-500">🎉 No pending listings!</p>
            <p className="text-sm text-gray-400 mt-2">Check back later</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image */}
                  <div className="md:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 break-words">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {listing.category} • {listing.condition}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-pink-600">
                        {listing.price} AFN
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span>👤 {listing.seller_name}</span>
                      <span>📱 {listing.seller_phone}</span>
                      <span>📍 {listing.seller_location}</span>
                      <span>
                        📅 {new Date(listing.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleApprove(listing.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-1"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(listing.id)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm flex items-center gap-1"
                      >
                        ⛔ Reject
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-1"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
