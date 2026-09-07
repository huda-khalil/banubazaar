import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
              className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden block hover:scale-[1.02]"
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
    </div>
  );
}
