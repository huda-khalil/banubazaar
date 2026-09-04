import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    if (listing?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (listing?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1,
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 text-lg">Item not found</p>
        <Link
          to="/home"
          className="text-pink-600 hover:underline mt-4 inline-block"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const images = listing.images || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/home"
        className="text-pink-600 hover:underline inline-block mb-6"
      >
        ← Back to Browse
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Image Carousel */}
        <div className="bg-gray-50 p-4 relative">
          {images.length > 0 ? (
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={listing.title}
                className="w-full max-h-96 object-contain rounded-lg"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800 text-4xl hover:text-pink-600 transition drop-shadow-lg"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 text-4xl hover:text-pink-600 transition drop-shadow-lg"
                    aria-label="Next image"
                  >
                    ›
                  </button>

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
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6">
          {/* Title & Price */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {listing.title}
            </h1>
            <span className="text-2xl font-bold text-pink-600 whitespace-nowrap">
              {listing.price} AFN
            </span>
          </div>

          {/* Category & Condition */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              {listing.category}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              {listing.condition}
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              📍 {listing.seller_location}
            </span>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {listing.description || "No description provided."}
            </p>
          </div>

          {/* Seller Info */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Seller Information
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
                📱 Contact on WhatsApp
              </a>
            </div>
          </div>

          {/* Posted Date */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="text-xs text-gray-400">
              Posted on {new Date(listing.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
