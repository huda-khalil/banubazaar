import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

// ✅ Resize image to fixed size (800x800)
const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const SIZE = 800; // 800x800
        canvas.width = SIZE;
        canvas.height = SIZE;

        const ctx = canvas.getContext("2d");

        // ✅ Crop to square center
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(
          img,
          sx,
          sy,
          minDim,
          minDim, // Source
          0,
          0,
          SIZE,
          SIZE, // Destination
        );

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          "image/jpeg",
          0.8,
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function Submit() {
  const { t } = useTranslation();

  // ✅ Categories — now uses t()
  const CATEGORIES = [
    { key: "Electronics", label: t("submit.categoryElectronics") },
    { key: "Clothing", label: t("submit.categoryClothing") },
    { key: "Home Goods", label: t("submit.categoryHome") },
    { key: "Books", label: t("submit.categoryBooks") },
    { key: "Kids", label: t("submit.categoryKids") },
    { key: "Artist's Corner", label: t("submit.categoryArt") },
    { key: "Other", label: t("submit.categoryOther") },
  ];

  // ✅ Conditions — now uses t()
  const CONDITIONS = [
    { key: "New", label: t("submit.conditionNew") },
    { key: "Like New", label: t("submit.conditionLikeNew") },
    { key: "Used", label: t("submit.conditionUsed") },
    { key: "Damaged", label: t("submit.conditionDamaged") },
  ];

  const [formData, setFormData] = useState({
    sellerName: "",
    sellerPhone: "",
    sellerLocation: "",
    socialPlatform: "instagram",
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
      try {
        // ✅ Resize image before uploading
        const resizedFile = await resizeImage(file);

        const fileExt = "jpg";
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { data, error } = await supabase.storage
          .from("listing-images")
          .upload(filePath, resizedFile);

        if (error) {
          setError("Failed to upload image: " + error.message);
          setUploading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      } catch (err) {
        setError("Failed to process image: " + err.message);
        setUploading(false);
        return;
      }
    }

    setImages(uploadedUrls);
    setUploading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sellerName || !formData.sellerPhone || !formData.title) {
      setError(t("submit.errorRequired"));
      return;
    }

    if (images.length === 0) {
      setError(t("submit.errorImage"));
      return;
    }

    try {
      const { data, error } = await supabase.from("listings").insert([
        {
          seller_name: formData.sellerName,
          seller_phone: `${formData.socialPlatform}:${formData.sellerPhone}`, // ✅ Save with prefix
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

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        sellerName: "",
        sellerPhone: "",
        sellerLocation: "",
        socialPlatform: "instagram", // ✅ Reset
        category: "",
        condition: "",
        price: "",
        title: "",
        description: "",
      });
      setImages([]);
    } catch (err) {
      setError(t("submit.errorSubmit") + err.message);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            ✅ {t("submit.success")}
          </h2>
          <p className="text-gray-700 mb-4">{t("submit.successMessage")}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-pink-600 hover:underline font-medium"
          >
            {t("submit.submitAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("submit.title")}</h1>

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
          <h3 className="font-semibold mb-3">{t("submit.sellerInfo")}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("submit.name")} *
            </label>
            <input
              type="text"
              required
              value={formData.sellerName}
              onChange={(e) =>
                setFormData({ ...formData, sellerName: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder={t("submit.namePlaceholder")}
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("submit.contact")} *
            </label>
            <div className="flex gap-2">
              {/* Platform Dropdown */}
              <select
                required
                value={formData.socialPlatform || "instagram"}
                onChange={(e) =>
                  setFormData({ ...formData, socialPlatform: e.target.value })
                }
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="instagram">📷 Instagram</option>
                <option value="facebook">👤 Facebook</option>
                <option value="email">✉️ Email</option>
              </select>

              {/* Handle / Email Input */}
              <input
                type="text"
                required
                value={formData.sellerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, sellerPhone: e.target.value })
                }
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder={
                  formData.socialPlatform === "email"
                    ? t("submit.contactEmailPlaceholder")
                    : t("submit.contactPlaceholder")
                }
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 italic">
              💡 {t("submit.contactHint")}
            </p>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("submit.location")} *
            </label>
            <input
              type="text"
              required
              value={formData.sellerLocation}
              onChange={(e) =>
                setFormData({ ...formData, sellerLocation: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder={t("submit.locationPlaceholder")}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">{t("submit.productDetails")}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("submit.titleLabel")} *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder={t("submit.titlePlaceholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("submit.category")} *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">{t("submit.selectCategory")}</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("submit.condition")} *
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">{t("submit.selectCondition")}</option>
                {CONDITIONS.map((cond) => (
                  <option key={cond.key} value={cond.key}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("submit.price")} *
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              pattern="[0-9]*"
              value={formData.price}
              onChange={(e) => {
                // ✅ Only allow numbers
                const value = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, price: value });
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder={t("submit.pricePlaceholder")}
            />
            {/* ✅ Price encouragement line */}
            <p className="text-xs text-pink-500 mt-1 italic">
              💡 {t("submit.priceHint")}
            </p>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("submit.description")} *
            </label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder={t("submit.descriptionPlaceholder")}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">{t("submit.photos")} *</h3>

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
                <span>{t("submit.uploading")}</span>
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
                    {t("submit.uploadInstructions")}
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
          {uploading ? t("submit.uploading") : t("submit.submit")}
        </button>

        <p className="text-xs text-gray-500 text-center">{t("submit.terms")}</p>
      </form>
    </div>
  );
}
