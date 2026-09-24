import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";

export default function ByAfghanWomen() {
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "approved")
        .eq("category", "By Afghan Women")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 mb-8 text-center border border-pink-200">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-700 mb-3">
          🇦🇫 {t("afghanWomen.title")}
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          {t("afghanWomen.subtitle")}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          {t("home.loading")}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">{t("afghanWomen.noItems")}</p>
          <Link
            to="/submit"
            className="text-pink-600 hover:underline mt-2 inline-block"
          >
            {t("home.beFirst")} 🌸
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {listings.map((item) => (
            <Link
              to={`/listing/${item.id}`}
              key={item.id}
              state={{ fromHome: true }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden block hover:scale-[1.02] border border-gray-100"
            >
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
                <p className="text-sm text-gray-500 mt-2">{item.condition}</p>
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
