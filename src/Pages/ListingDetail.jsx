import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import ReportModal from "../Components/ReportModal";
import ShareButtons from "../Components/ShareButtons";
import Toast from "../Components/Toast";
import { useLocation } from "react-router-dom";

export default function ListingDetail() {
  const [toast, setToast] = useState(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const location = useLocation();
  // Check if we came from homepage
  const fromHome = location.state?.fromHome || false;
  const savedScrollY = location.state?.scrollY || 0;
  //  Handle back button
  const handleBack = () => {
    if (fromHome) {
      // Navigate back to home with the saved scroll position
      navigate("/home", { state: { scrollTo: savedScrollY } });
    } else {
      navigate("/home");
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (err) {
      setError("Listing not found");
    } finally {
      setLoading(false);
    }
  };
  const nextImage = () => {
    if (!listing?.images?.length) return;

    // In RTL, "next" visually means going left, so we go backward
    const isRTL = document.documentElement.dir === "rtl";
    const direction = isRTL ? -1 : 1;

    const newIndex = currentImageIndex + direction;
    if (newIndex < 0) {
      setCurrentImageIndex(listing.images.length - 1);
    } else if (newIndex >= listing.images.length) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(newIndex);
    }
  };

  const prevImage = () => {
    if (!listing?.images?.length) return;

    // In RTL, "previous" visually means going right, so we go forward
    const isRTL = document.documentElement.dir === "rtl";
    const direction = isRTL ? 1 : -1;

    const newIndex = currentImageIndex + direction;
    if (newIndex < 0) {
      setCurrentImageIndex(listing.images.length - 1);
    } else if (newIndex >= listing.images.length) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(newIndex);
    }
  };

  // Get translated category name
  const getCategoryLabel = (categoryKey) => {
    const map = {
      Electronics: t("home.categories.electronics"),
      Clothing: t("home.categories.clothing"),
      "Home Goods": t("home.categories.home"),
      Books: t("home.categories.books"),
      Other: t("home.categories.other"),
    };
    return map[categoryKey] || categoryKey;
  };

  // Get translated condition name
  const getConditionLabel = (conditionKey) => {
    const map = {
      New: t("submit.conditionNew"),
      "Like New": t("submit.conditionLikeNew"),
      Used: t("submit.conditionUsed"),
      Damaged: t("submit.conditionDamaged"),
    };
    return map[conditionKey] || conditionKey;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        {t("detail.loading")}
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 text-lg">{t("detail.notFound")}</p>
        <button
          onClick={() => {
            if (window.history.state?.fromHome) {
              window.history.back();
            } else {
              window.location.href = "/home";
            }
          }}
          className="text-pink-600 hover:underline mt-4 inline-block cursor-pointer"
        >
          ← {t("detail.back")}
        </button>
      </div>
    );
  }

  const images = listing.images || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="text-pink-600 hover:underline inline-block mb-6 cursor-pointer bg-transparent border-none text-base"
      >
        ← {t("detail.back")}
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image Carousel */}
        <div className="relative bg-gray-50 p-4">
          {/* Sold Badge */}
          {listing.status === "sold" && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-20">
              {t("common.sold")}
            </div>
          )}

          {images.length > 0 ? (
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={listing.title}
                className="w-full max-h-96 object-contain rounded-lg"
              />

              {images.length > 1 && (
                <>
                  {/* ✅ Arrows — Centered with inset-0 */}
                  <div
                    className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none"
                    dir="ltr"
                  >
                    {/* Left Arrow — ALWAYS goes previous */}
                    <button
                      onClick={prevImage}
                      className="pointer-events-auto text-pink-400 text-5xl hover:text-pink-300 transition drop-shadow-lg z-10"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>

                    {/* Right Arrow — ALWAYS goes next */}
                    <button
                      onClick={nextImage}
                      className="pointer-events-auto text-pink-400 text-5xl hover:text-pink-300 transition drop-shadow-lg z-10"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 mt-4 justify-center overflow-x-auto py-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                          idx === currentImageIndex
                            ? "border-pink-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
              {t("common.noImage")}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {listing.title}
            </h1>
            <span className="text-2xl font-bold text-pink-600 whitespace-nowrap">
              {listing.price} AFN
            </span>
          </div>

          {/* Category & Condition — Translated */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              {getCategoryLabel(listing.category)}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              {getConditionLabel(listing.condition)}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              📍 {listing.seller_location}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {t("detail.description")}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {listing.description || t("detail.noDescription")}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {t("detail.seller")}
            </h3>
            <div className="bg-pink-50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-800">
                  {listing.seller_name}
                </p>
                <p className="text-sm text-gray-500">{listing.seller_phone}</p>
              </div>
              <a
                href={`https://wa.me/93${listing.seller_phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                📱 {t("detail.contact")}
              </a>
            </div>

            {/* Report Button */}
            <button
              onClick={() => setShowReportModal(true)}
              className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1 mt-4"
            >
              🚩 {t("detail.report")}
            </button>
            {/* Share Buttons */}
            <ShareButtons
              title={listing.title}
              url={window.location.href}
              onCopy={(message) => setToast({ message, type: "success" })}
            />
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-xs text-gray-400">
              {t("detail.posted")}{" "}
              {new Date(listing.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          listingId={listing.id}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => {}}
        />
      )}
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
