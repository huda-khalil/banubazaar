import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import Toast from "../Components/Toast";
import ConfirmModal from "../Components/ConfirmModal";
import { useLocation } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Clothing",
  "Electronics",
  "Home Goods",
  "Books",
  "Other",
];

export default function Home() {
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const location = useLocation();

  // ✅ Save scroll position continuously as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem("homeScrollY", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // ✅ Restore scroll position when coming back
  useEffect(() => {
    if (!loading && location.state?.fromDetail) {
      const savedY = sessionStorage.getItem("homeScrollY");
      if (savedY) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedY),
            behavior: "instant",
          });
        });
      }
    }
  }, [loading, location]);

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

  // Get translated category name
  const getCategoryLabel = (categoryKey) => {
    const map = {
      All: t("home.categories.all"),
      Clothing: t("home.categories.clothing"),
      Electronics: t("home.categories.electronics"),
      "Home Goods": t("home.categories.home"),
      Books: t("home.categories.books"),
      Other: t("home.categories.other"),
    };
    return map[categoryKey] || categoryKey;
  };

  // ✅ Get translated condition name
  const getConditionLabel = (conditionKey) => {
    const map = {
      New: t("submit.conditionNew"),
      "Like New": t("submit.conditionLikeNew"),
      Used: t("submit.conditionUsed"),
      Damaged: t("submit.conditionDamaged"),
    };
    return map[conditionKey] || conditionKey;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* How It Works Section */}
      <div className="mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {t("home.howItWorks.title")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              📸
            </div>
            <h4 className="font-semibold text-gray-800">
              {t("home.howItWorks.step1.title")}
            </h4>
            <p className="text-sm text-gray-500">
              {t("home.howItWorks.step1.desc")}
            </p>
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              {t("home.howItWorks.step1.warning")}
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              💬
            </div>
            <h4 className="font-semibold text-gray-800">
              {t("home.howItWorks.step2.title")}
            </h4>
            <p className="text-sm text-gray-500">
              {t("home.howItWorks.step2.desc")}
            </p>
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              {t("home.howItWorks.step2.warning")}
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              🤝
            </div>
            <h4 className="font-semibold text-gray-800">
              {t("home.howItWorks.step3.title")}
            </h4>
            <p className="text-sm text-gray-500">
              {t("home.howItWorks.step3.desc")}
            </p>
            <p className="text-xs text-yellow-600 mt-2 font-medium">
              {t("home.howItWorks.step3.warning")}
            </p>
          </div>
        </div>
        {/* Disclaimer */}
        <div className="text-center text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <p className="max-w-3xl mx-auto">{t("home.disclaimer")}</p>
        </div>
      </div>
      {/* ✅ Start Selling Button — Above Categories
      <div className="mb-6">
        <Link
          to="/submit"
          className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition shadow-md"
        >
          🌟 {t("landing.startSelling")}
        </Link> 
      </div>*/}
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          🛍️ {t("home.title")}
        </h2>
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
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>
      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          {t("home.loading")}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">{t("home.noItems")}</p>
          <Link
            to="/submit"
            className="text-pink-600 hover:underline mt-2 inline-block"
          >
            {t("home.beFirst")} 🌸
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredListings.map((item) => (
            <Link
              to={`/listing/${item.id}`}
              key={item.id}
              state={{ fromHome: true }} // ✅ Just a flag, no scroll value
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden block hover:scale-[1.02]"
            >
              {/* Sold Badge  */}
              {item.status === "sold" && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                  {t("common.sold")}
                </div>
              )}

              {item.images?.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  {t("common.noImage")}
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
                  <span>{getCategoryLabel(item.category)}</span>
                  <span>•</span>
                  <span>{getConditionLabel(item.condition)}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  📍 {item.seller_location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {/* Share BanuBazaar */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {t("share.siteTitle")}
            </p>
            <p className="text-xs text-gray-400">{t("share.siteSubtitle")}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(t("share.siteMessage"))}%20${encodeURIComponent(window.location.origin)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-medium rounded-lg hover:opacity-80 transition"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                setToast({ message: t("share.copied"), type: "success" });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-300 transition"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              {t("share.copyLink")}
            </button>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={() => {
            confirmModal.onConfirm();
            setConfirmModal(null);
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
