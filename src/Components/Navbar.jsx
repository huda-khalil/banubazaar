import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";
import logo from "../assets/logo3.jpg";
import BrandName from "./BrandName";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            style={{ marginRight: "-25px" }}
            src={logo}
            alt="BanuBazaar"
            className="h-24 w-28 object-contain"
          />
          <div>
            {/* <h1 className="text-2xl font-bold text-pink-600">BanuBazaar</h1> */}
            <BrandName size="text-2xl md:text-3xl" />
            <p className="text-sm text-gray-500 leading-tight">
              {t("landing.tagline")}
            </p>
            <p className="text-xs text-pink-400 font-medium mt-0.5">
              🌸 {t("landing.subtitle")}
            </p>
          </div>
        </Link>

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
            to="/admin"
            className="text-gray-400 hover:text-pink-600 transition text-sm"
          >
            {t("nav.admin")}
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
