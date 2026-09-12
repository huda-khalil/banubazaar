import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

export default function EditListing() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchListing();
  }, [token]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("secret_token", token)
        .single();

      if (error || !data) throw new Error("Listing not found");

      setListing(data);
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price,
      });
    } catch (err) {
      setError("Listing not found or link is invalid.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("listings")
        .update({
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          updated_at: new Date().toISOString(),
        })
        .eq("secret_token", token);

      if (error) throw error;
      setSuccess("✅ Listing updated successfully!");
    } catch (err) {
      setError("Failed to update: " + err.message);
    }
  };

  // ✅ Mark as Sold
  const handleMarkAsSold = async () => {
    if (
      !window.confirm(
        "Mark this listing as sold? It will be removed from the homepage.",
      )
    )
      return;

    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: "sold", updated_at: new Date().toISOString() })
        .eq("secret_token", token);

      if (error) throw error;
      alert("✅ Marked as sold! It will no longer appear on the homepage.");
      navigate("/home");
    } catch (err) {
      setError("Failed to mark as sold: " + err.message);
    }
  };

  // ✅ Delete Listing
  const handleDelete = async () => {
    if (
      !window.confirm("Delete your listing permanently? This cannot be undone.")
    )
      return;

    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("secret_token", token);

      if (error) throw error;
      alert("✅ Listing deleted!");
      navigate("/home");
    } catch (err) {
      setError("Failed to delete: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
        {t("detail.loading")}
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        {t("editListing.title")}
      </h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleUpdate}
        className="space-y-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("editListing.titleLabel")}
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("editListing.priceLabel")}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formData.price}
            onChange={(e) => {
              const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
              const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
              let value = e.target.value;
              value = value.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
              value = value.replace(/[٠-٩]/g, (d) => arabicDigits.indexOf(d));
              value = value.replace(/[^0-9]/g, "");
              setFormData({ ...formData, price: value });
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("editListing.descriptionLabel")}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Save */}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2.5 rounded-lg hover:bg-pink-700 transition font-medium"
        >
          💾 {t("editListing.save")}
        </button>
      </form>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleMarkAsSold}
          className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          💰 {t("editListing.markAsSold")}
        </button>

        <button
          onClick={handleDelete}
          className="w-full bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg hover:bg-red-100 transition font-medium"
        >
          🗑️ {t("editListing.delete")}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        {t("editListing.note")}
      </p>
    </div>
  );
}
