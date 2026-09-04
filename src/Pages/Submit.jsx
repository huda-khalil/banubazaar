import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const CATEGORIES = ["Electronics", "Clothing", "Home Goods", "Books", "Other"];
const CONDITIONS = ["New", "Like New", "Used", "Damaged"];

export default function Submit() {
  const [formData, setFormData] = useState({
    sellerName: "",
    sellerPhone: "",
    sellerLocation: "",
    category: "",
    condition: "",
    price: "",
    title: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls = [];

    for (let file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { data, error } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);

      if (error) {
        setError("Failed to upload image: " + error.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
    }

    setImages(uploadedUrls);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submitted!");
    console.log("Form data:", formData);
    console.log("Images:", images);

    // Validation
    if (!formData.sellerName || !formData.sellerPhone || !formData.title) {
      console.log("❌ Validation failed: Missing required fields");
      setError("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      console.log("❌ Validation failed: No images");
      setError("Please upload at least one image");
      return;
    }

    console.log("✅ Validation passed, sending to Supabase...");

    try {
      const { data, error } = await supabase.from("listings").insert([
        {
          seller_name: formData.sellerName,
          seller_phone: formData.sellerPhone,
          seller_location: formData.sellerLocation,
          category: formData.category,
          condition: formData.condition,
          price: parseInt(formData.price),
          title: formData.title,
          description: formData.description,
          images: images,
          status: "pending",
        },
      ]);

      console.log("📦 Supabase response:", { data, error });

      if (error) {
        console.log("❌ Supabase error:", error);
        throw error;
      }

      console.log("✅ Success! Listing submitted");
      setSubmitted(true);
      setFormData({
        sellerName: "",
        sellerPhone: "",
        sellerLocation: "",
        category: "",
        condition: "",
        price: "",
        title: "",
        description: "",
      });
      setImages([]);
    } catch (err) {
      console.log("❌ Catch block error:", err);
      setError("Failed to submit: " + err.message);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            ✅ Listing Submitted!
          </h2>
          <p className="text-gray-700 mb-4">
            Your item is now waiting for approval. We'll review it within 24
            hours.
          </p>
          <p className="text-sm text-gray-500">
            You'll receive a confirmation message when it's published.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Submit another item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Sell Your Item</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
          <button onClick={() => setError("")} className="float-right">
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seller Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Your Contact Info</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={formData.sellerName}
              onChange={(e) =>
                setFormData({ ...formData, sellerName: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., Fatima Karimi"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (WhatsApp preferred) *
            </label>
            <input
              type="tel"
              required
              value={formData.sellerPhone}
              onChange={(e) =>
                setFormData({ ...formData, sellerPhone: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 0788 123 456"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Location (District/Area) *
            </label>
            <input
              type="text"
              required
              value={formData.sellerLocation}
              onChange={(e) =>
                setFormData({ ...formData, sellerLocation: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., Karte Parwan, Kabul"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Product Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., iPhone 12 Pro - 256GB"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition *
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select...</option>
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (AFN) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 15000"
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Describe your item, including any defects or special features..."
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Upload Photos *</h3>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload photos (max 5)
                  </p>
                </>
              )}
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== idx))
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Submit Listing"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to our terms. All listings are reviewed
          before publishing.
        </p>
      </form>
    </div>
  );
}
