import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRTL = i18n.language === "fa";

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            src={logo}
            alt="BanuBazaar"
            className="h-10 w-12 md:h-16 md:w-20 object-contain"
          />
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-pink-600">
              BanuBazaar
            </h1>
            <p className="text-xs text-gray-500 leading-tight hidden xs:block">
              {t("landing.tagline")}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            to="/home"
            className="text-gray-600 hover:text-pink-600 transition"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/submit"
            className="text-pink-600 font-semibold hover:text-pink-700 transition"
          >
            {t("nav.sell")}
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-pink-600 transition"
          >
            {t("nav.contact")}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-gray-400 hover:text-pink-600 transition text-sm"
            >
              {t("nav.admin")}
            </Link>
          )}
          <LanguageToggle />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-pink-600 transition p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation — Slides down from under the header */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="bg-gray-50/95 backdrop-blur-sm border-t border-gray-100 py-4 px-4 space-y-1 shadow-lg">
          <Link
            to="/home"
            className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/submit"
            className="block px-4 py-2.5 rounded-lg text-pink-600 font-semibold hover:bg-pink-50 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.sell")}
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.contact")}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="block px-4 py-2.5 rounded-lg text-gray-400 hover:bg-pink-50 hover:text-pink-600 transition text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.admin")}
            </Link>
          )}
          <div className="px-4 pt-3 mt-1 border-t border-gray-200/60">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
