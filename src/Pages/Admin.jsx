import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Admin() {
  const [reports, setReports] = useState([]);
  const [soldListings, setSoldListings] = useState([]);
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    seller_name: "",
    seller_phone: "",
    seller_location: "",
  });

  const ADMIN_PASSWORD = "banubazaar2025";

  const CATEGORIES = [
    "Electronics",
    "Clothing",
    "Home Goods",
    "Books",
    "Other",
  ];
  const CONDITIONS = ["New", "Like New", "Used", "Damaged"];

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
  const [approvedListings, setApprovedListings] = useState([]);
  const fetchSoldListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "sold")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSoldListings(data || []);
    } catch (err) {
      console.error("Error fetching sold listings:", err);
    }
  };

  const fetchApprovedListings = async () => {
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApprovedListings(data || []);
    } catch (err) {
      console.error("Error fetching approved listings:", err);
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
  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*, listings(title)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // Load listings when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingListings();
      fetchApprovedListings();
      fetchSoldListings();
      fetchReports();
    }
  }, [isAuthenticated]);

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
      fetchPendingListings();
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
      fetchPendingListings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to reject: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Delete listing
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
      fetchPendingListings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };
  const handleMarkAsSold = async (id) => {
    if (!window.confirm("Mark this listing as sold?")) return;

    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: "sold" })
        .eq("id", id);

      if (error) throw error;

      setSuccess("💰 Item marked as sold!");
      fetchApprovedListings(); // ✅ Refresh the approved list
      fetchPendingListings(); // Also refresh pending in case
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to mark as sold: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };
  const handleDeleteSoldItem = async (id) => {
    if (!window.confirm(t("admin.confirmDeleteSold"))) return;

    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);

      if (error) throw error;

      setSuccess("🗑️ Sold item removed from history!");
      fetchSoldListings(); // Refresh the sold list
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Resolve Report
  const handleResolveReport = async (reportId) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "reviewed" })
        .eq("id", reportId);

      if (error) throw error;

      setSuccess("✅ Report resolved!");
      fetchReports();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to resolve report: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Dismiss Report
  const handleDismissReport = async (reportId) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status: "dismissed" })
        .eq("id", reportId);

      if (error) throw error;

      setSuccess("❌ Report dismissed.");
      fetchReports();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to dismiss report: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Delete Report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report permanently?")) return;

    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);

      if (error) throw error;

      setSuccess("🗑️ Report deleted.");
      fetchReports();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete report: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };
  // Start editing
  const startEditing = (listing) => {
    setEditingListing(listing.id);
    setEditForm({
      title: listing.title || "",
      price: listing.price || "",
      description: listing.description || "",
      category: listing.category || "",
      condition: listing.condition || "",
      seller_name: listing.seller_name || "",
      seller_phone: listing.seller_phone || "",
      seller_location: listing.seller_location || "",
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingListing(null);
    setEditForm({
      title: "",
      price: "",
      description: "",
      category: "",
      condition: "",
      seller_name: "",
      seller_phone: "",
      seller_location: "",
    });
  };

  // Save edited listing
  const handleSaveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({
          title: editForm.title,
          price: parseInt(editForm.price),
          description: editForm.description,
          category: editForm.category,
          condition: editForm.condition,
          seller_name: editForm.seller_name,
          seller_phone: editForm.seller_phone,
          seller_location: editForm.seller_location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      setSuccess("✅ Listing updated successfully!");
      setEditingListing(null);
      fetchPendingListings();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update: " + err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

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
      <header className="bg-white shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-pink-600">
              🛍️ BanuBazaar Admin
            </h1>
            <p className="text-sm text-gray-500">Manage listings</p>
          </div>
          <div className="flex items-center gap-4">
            {/* 🔔 Notification Badge */}
            <Link to="#reports" className="relative">
              <span className="text-xl">🔔</span>
              {reports.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {reports.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-gray-500 hover:text-red-600 text-sm"
            >
              Logout
            </button>
          </div>
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
                {/* Edit Mode */}
                {editingListing === listing.id ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      ✏️ Edit Listing
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (AFN)
                        </label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition
                        </label>
                        <select
                          value={editForm.condition}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              condition: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        >
                          {CONDITIONS.map((cond) => (
                            <option key={cond} value={cond}>
                              {cond}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              description: e.target.value,
                            })
                          }
                          rows="3"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Seller Name
                        </label>
                        <input
                          type="text"
                          value={editForm.seller_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              seller_name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={editForm.seller_phone}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              seller_phone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editForm.seller_location}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              seller_location: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(listing.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        💾 Save Changes
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal View */
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
                          onClick={() => startEditing(listing)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex items-center gap-1"
                        >
                          🗑️ Delete
                        </button>
                        <button
                          onClick={() => handleMarkAsSold(listing.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm flex items-center gap-1"
                        >
                          💰 {t("admin.markAsSold")}
                        </button>
                        ;
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* 📋 Manage Active Listings */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📋 {t("admin.manageActive")}
          </h2>

          {approvedListings.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">{t("admin.noActive")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approvedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition"
                >
                  {/* Edit Mode */}
                  {editingListing === listing.id ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-800">
                        ✏️ {t("admin.editListing")}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.title")}
                          </label>
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.price")}
                          </label>
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.category")}
                          </label>
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.condition")}
                          </label>
                          <select
                            value={editForm.condition}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                condition: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          >
                            {CONDITIONS.map((cond) => (
                              <option key={cond} value={cond}>
                                {cond}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.description")}
                          </label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            rows="3"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.sellerName")}
                          </label>
                          <input
                            type="text"
                            value={editForm.seller_name}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                seller_name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.sellerPhone")}
                          </label>
                          <input
                            type="text"
                            value={editForm.seller_phone}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                seller_phone: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("admin.sellerLocation")}
                          </label>
                          <input
                            type="text"
                            value={editForm.seller_location}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                seller_location: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(listing.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          💾 {t("admin.save")}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                          {t("admin.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal View */
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="md:w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {listing.images?.length > 0 ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            {t("common.noImage")}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
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

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span>👤 {listing.seller_name}</span>
                          <span>📍 {listing.seller_location}</span>
                          <span>
                            📅{" "}
                            {new Date(listing.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {/* ✅ Edit Button — Now in Active Listings */}
                          <button
                            onClick={() => startEditing(listing)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-1"
                          >
                            ✏️ {t("admin.edit")}
                          </button>

                          {/* Mark as Sold Button */}
                          {listing.status === "sold" ? (
                            <span className="inline-block px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-medium">
                              ✅ {t("admin.alreadySold")}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkAsSold(listing.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm flex items-center gap-1"
                            >
                              💰 {t("admin.markAsSold")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 📋 Sold Items */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📦 {t("admin.soldItems")}
          </h2>

          {soldListings.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">{t("admin.noSoldItems")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {soldListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    <div className="md:w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                      {listing.images?.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover opacity-75"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          {t("common.noImage")}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {listing.category} • {listing.condition}
                          </p>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {listing.price} AFN
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span>👤 {listing.seller_name}</span>
                        <span>📍 {listing.seller_location}</span>
                        <span>
                          📅 {new Date(listing.created_at).toLocaleDateString()}
                        </span>
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          ✅ {t("admin.sold")}
                        </span>
                      </div>

                      {/* Optional: Delete button for sold items */}
                      <div className="mt-3">
                        <button
                          onClick={() => handleDeleteSoldItem(listing.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
                        >
                          🗑️ {t("admin.deleteSold")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 📋 Reports Section */}
        <div id="reports" className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🚩 {t("admin.reports")} ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">{t("admin.noReports")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    {/* Report Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {report.listings?.title || "Unknown listing"}
                        </span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          {t(`report.options.${report.reason}`) ||
                            report.reason}
                        </span>
                      </div>

                      {report.reporter_phone && (
                        <p className="text-sm text-gray-500 mt-1">
                          📱 {report.reporter_phone}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        📅 {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleResolveReport(report.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-1"
                      >
                        ✅ {t("admin.resolve")}
                      </button>
                      <button
                        onClick={() => handleDismissReport(report.id)}
                        className="px-3 py-1.5 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition text-sm flex items-center gap-1"
                      >
                        ❌ {t("admin.dismiss")}
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
                      >
                        🗑️ {t("admin.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
