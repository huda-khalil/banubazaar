import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import BrandName from "./BrandName";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        {/* Logo — ONE line under BanuBazaar */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <img
            src={logo}
            alt="BanuBazaar"
            className="h-10 w-12 md:h-14 md:w-16 object-contain"
          />
          <div>
            <BrandName size="text-xl md:text-2xl" />
            <p className="text-xs text-pink-400 font-medium leading-tight">
              Kabul's Marketplace for Women
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/home"
            className="text-sm font-medium text-gray-600 hover:text-pink-600 transition"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/submit"
            className="text-sm font-medium text-pink-600 hover:text-pink-700 transition"
          >
            {t("nav.sell")}
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-gray-600 hover:text-pink-600 transition"
          >
            {t("nav.contact")}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-gray-400 hover:text-pink-600 transition"
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

      {/* Mobile Navigation — Centered Dropdown with Pink Border */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="bg-white/95 backdrop-blur-sm border-t-2 border-pink-200 shadow-xl rounded-b-2xl mx-4 my-1 p-4 space-y-1">
          <Link
            to="/home"
            className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition font-medium border border-transparent hover:border-pink-200"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/submit"
            className="block text-center px-4 py-3 rounded-xl text-pink-600 font-semibold hover:bg-pink-50 transition border border-transparent hover:border-pink-200"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.sell")}
          </Link>
          <Link
            to="/contact"
            className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition font-medium border border-transparent hover:border-pink-200"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.contact")}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="block text-center px-4 py-3 rounded-xl text-gray-400 hover:bg-pink-50 hover:text-pink-600 transition font-medium text-sm border border-transparent hover:border-pink-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.admin")}
            </Link>
          )}
          <div className="text-center pt-3 mt-2 border-t border-gray-100">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
