import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            src={logo}
            alt="BanuBazaar"
            className="h-12 w-14 md:h-20 md:w-24 object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-bold text-pink-600">
              BanuBazaar
            </h1>
            <p className="text-xs text-gray-500 leading-tight hidden md:block">
              {t("landing.tagline")}
            </p>
            <p className="text-xs text-pink-400 font-medium mt-0.5 hidden lg:block">
              Kabul's Marketplace for Women
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
          className="md:hidden text-gray-600 hover:text-pink-600 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
          <Link
            to="/home"
            className="block text-gray-600 hover:text-pink-600 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/submit"
            className="block text-pink-600 font-semibold hover:text-pink-700 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.sell")}
          </Link>
          <Link
            to="/contact"
            className="block text-gray-600 hover:text-pink-600 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.contact")}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="block text-gray-400 hover:text-pink-600 transition text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.admin")}
            </Link>
          )}
          <div className="pt-2">
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
