import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);

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
            className="h-20 w-24 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-pink-600">BanuBazaar</h1>
            <p className="text-sm text-gray-500 leading-tight">
              {t("landing.tagline")}
            </p>
            <p className="text-xs text-pink-400 font-medium mt-0.5">
              Kabul's Marketplace for Women
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-x-4 flex items-center">
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
          {/* ✅ Admin Link — Only visible when logged in */}
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
      </div>
    </header>
  );
}
